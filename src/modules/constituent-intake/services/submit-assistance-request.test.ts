import { describe, expect, it, vi } from "vitest";

import type { AssistanceRequest } from "../domain/assistance-request";
import { BotVerificationError, DuplicateIntakeError } from "../domain/intake-errors";
import type { BotVerifier, IntakeNotifier, IntakeRepository } from "./intake-ports";
import { submitAssistanceRequest } from "./submit-assistance-request";

const request: AssistanceRequest = {
  category: "general_question",
  consent: true,
  description: "This is a fictional request used only for an automated test.",
  email: "resident@example.test",
  name: "Fictional Resident",
  preferredContactMethod: "email",
  subject: "Fictional test request",
  turnstileToken: "fictional-token",
  website: "",
};

function dependencies() {
  const botVerifier: BotVerifier = { verify: vi.fn().mockResolvedValue(true) };
  const notifier: IntakeNotifier = {
    sendAcknowledgment: vi.fn().mockResolvedValue(undefined),
    sendAdminNotification: vi.fn().mockResolvedValue(undefined),
  };
  const repository: IntakeRepository = {
    create: vi.fn().mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      referenceId: "MC-2026-ABCDEF1234",
    }),
    recordEmailOutcome: vi.fn().mockResolvedValue(undefined),
  };

  return { botVerifier, notifier, repository };
}

const context = {
  hashSecret: "a-long-fictional-secret-used-only-for-tests",
  remoteIp: "192.0.2.10",
  sourceContext: "independent_community_platform" as const,
  userAgent: "fictional-browser",
};

describe("assistance submission service", () => {
  it("stores the case before sending reference-only notifications", async () => {
    const deps = dependencies();

    const created = await submitAssistanceRequest(request, context, deps);

    expect(created.referenceId).toBe("MC-2026-ABCDEF1234");
    expect(deps.repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        rateKey: expect.stringMatching(/^[a-f0-9]{64}$/),
        submissionFingerprint: expect.stringMatching(/^[a-f0-9]{64}$/),
      }),
    );
    expect(deps.notifier.sendAdminNotification).toHaveBeenCalledWith({
      referenceId: "MC-2026-ABCDEF1234",
    });
    expect(deps.notifier.sendAcknowledgment).toHaveBeenCalledWith({
      recipient: "resident@example.test",
      referenceId: "MC-2026-ABCDEF1234",
    });
  });

  it("reports success after storage even when email and failure-audit delivery fail", async () => {
    const deps = dependencies();
    vi.mocked(deps.notifier.sendAdminNotification).mockRejectedValue(new Error("provider unavailable"));
    vi.mocked(deps.notifier.sendAcknowledgment).mockRejectedValue(new Error("provider unavailable"));
    vi.mocked(deps.repository.recordEmailOutcome).mockRejectedValue(new Error("audit unavailable"));

    await expect(submitAssistanceRequest(request, context, deps)).resolves.toMatchObject({
      referenceId: "MC-2026-ABCDEF1234",
    });
    expect(deps.repository.recordEmailOutcome).toHaveBeenCalledTimes(2);
  });

  it("does not create a case when bot verification fails", async () => {
    const deps = dependencies();
    vi.mocked(deps.botVerifier.verify).mockResolvedValue(false);

    await expect(submitAssistanceRequest(request, context, deps)).rejects.toBeInstanceOf(
      BotVerificationError,
    );
    expect(deps.repository.create).not.toHaveBeenCalled();
  });

  it("propagates duplicate protection without sending email", async () => {
    const deps = dependencies();
    vi.mocked(deps.repository.create).mockRejectedValue(new DuplicateIntakeError());

    await expect(submitAssistanceRequest(request, context, deps)).rejects.toBeInstanceOf(
      DuplicateIntakeError,
    );
    expect(deps.notifier.sendAdminNotification).not.toHaveBeenCalled();
    expect(deps.notifier.sendAcknowledgment).not.toHaveBeenCalled();
  });
});
