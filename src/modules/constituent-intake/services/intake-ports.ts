import type { AssistanceRequest } from "@/modules/constituent-intake/domain/assistance-request";

export type IntakeCreateInput = {
  request: AssistanceRequest;
  rateKey: string;
  submissionFingerprint: string;
  sourceContext: "independent_community_platform" | "official_constituent_service";
};

export type CreatedIntakeCase = {
  id: string;
  referenceId: string;
};

export interface IntakeRepository {
  create(input: IntakeCreateInput): Promise<CreatedIntakeCase>;
  recordEmailOutcome(input: {
    caseId: string;
    eventType: "ACKNOWLEDGMENT_EMAIL_FAILED" | "ADMIN_NOTIFICATION_EMAIL_FAILED";
  }): Promise<void>;
}

export interface IntakeNotifier {
  sendAcknowledgment(input: {
    recipient: string;
    referenceId: string;
  }): Promise<void>;
  sendAdminNotification(input: {
    referenceId: string;
  }): Promise<void>;
}

export interface BotVerifier {
  verify(input: { remoteIp?: string; token: string }): Promise<boolean>;
}
