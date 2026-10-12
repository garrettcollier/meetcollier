import { createHmac } from "node:crypto";

import type { AssistanceRequest } from "@/modules/constituent-intake/domain/assistance-request";
import { BotVerificationError } from "@/modules/constituent-intake/domain/intake-errors";
import type {
  BotVerifier,
  IntakeNotifier,
  IntakeRepository,
} from "@/modules/constituent-intake/services/intake-ports";

type SubmitContext = {
  hashSecret: string;
  remoteIp?: string;
  sourceContext: "independent_community_platform" | "official_constituent_service";
  userAgent?: string;
};

type SubmitDependencies = {
  botVerifier: BotVerifier;
  notifier: IntakeNotifier;
  repository: IntakeRepository;
};

function digest(secret: string, value: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export async function submitAssistanceRequest(
  request: AssistanceRequest,
  context: SubmitContext,
  dependencies: SubmitDependencies,
) {
  const verified = await dependencies.botVerifier.verify({
    remoteIp: context.remoteIp,
    token: request.turnstileToken,
  });

  if (!verified) {
    throw new BotVerificationError();
  }

  const rateKey = digest(
    context.hashSecret,
    `${context.remoteIp ?? "unknown"}|${context.userAgent ?? "unknown"}`,
  );
  const submissionFingerprint = digest(
    context.hashSecret,
    [
      request.email?.toLowerCase() ?? "",
      request.phone?.replace(/\D/g, "") ?? "",
      request.category,
      request.subject.toLowerCase(),
      request.description.toLowerCase(),
    ].join("|"),
  );

  const createdCase = await dependencies.repository.create({
    rateKey,
    request,
    sourceContext: context.sourceContext,
    submissionFingerprint,
  });

  async function recordEmailFailure(
    eventType: "ACKNOWLEDGMENT_EMAIL_FAILED" | "ADMIN_NOTIFICATION_EMAIL_FAILED",
  ) {
    try {
      await dependencies.repository.recordEmailOutcome({
        caseId: createdCase.id,
        eventType,
      });
    } catch {
      // The case is already safely stored. A secondary audit-write failure must
      // not cause the resident to resubmit and create an apparent duplicate.
    }
  }

  const notifications = [
    dependencies.notifier
      .sendAdminNotification({ referenceId: createdCase.referenceId })
      .catch(() => recordEmailFailure("ADMIN_NOTIFICATION_EMAIL_FAILED")),
  ];

  if (request.email) {
    notifications.push(
      dependencies.notifier
        .sendAcknowledgment({
          recipient: request.email,
          referenceId: createdCase.referenceId,
        })
        .catch(() => recordEmailFailure("ACKNOWLEDGMENT_EMAIL_FAILED")),
    );
  }

  await Promise.all(notifications);

  return createdCase;
}
