import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  DuplicateIntakeError,
  IntakeRateLimitedError,
} from "@/modules/constituent-intake/domain/intake-errors";
import type {
  CreatedIntakeCase,
  IntakeCreateInput,
  IntakeRepository,
} from "@/modules/constituent-intake/services/intake-ports";

type CreateCaseRow = {
  case_id: string;
  public_reference: string;
};

export class SupabaseIntakeRepository implements IntakeRepository {
  async create(input: IntakeCreateInput): Promise<CreatedIntakeCase> {
    const supabase = createAdminClient();
    const { request } = input;
    const { data, error } = await supabase.rpc("create_public_assistance_case", {
      p_category: request.category,
      p_description: request.description,
      p_email: request.email ?? null,
      p_general_location: request.generalLocation ?? null,
      p_name: request.name,
      p_official_reference: request.officialServiceRequestReference ?? null,
      p_phone: request.phone ?? null,
      p_preferred_contact_method: request.preferredContactMethod,
      p_rate_key: input.rateKey,
      p_rate_limit: 5,
      p_source_context: input.sourceContext,
      p_subject: request.subject,
      p_submission_fingerprint: input.submissionFingerprint,
    });

    if (error) {
      if (error.message.includes("INTAKE_RATE_LIMITED")) {
        throw new IntakeRateLimitedError();
      }
      if (error.message.includes("INTAKE_DUPLICATE")) {
        throw new DuplicateIntakeError();
      }
      throw new Error("The case could not be created.");
    }

    const row = (Array.isArray(data) ? data[0] : data) as CreateCaseRow | null;
    if (!row?.case_id || !row.public_reference) {
      throw new Error("The case repository returned an invalid result.");
    }

    return { id: row.case_id, referenceId: row.public_reference };
  }

  async recordEmailOutcome(input: {
    caseId: string;
    eventType: "ACKNOWLEDGMENT_EMAIL_FAILED" | "ADMIN_NOTIFICATION_EMAIL_FAILED";
  }) {
    const supabase = createAdminClient();
    const { error } = await supabase.from("case_events").insert({
      case_id: input.caseId,
      event_type: input.eventType,
      metadata: { provider: "resend" },
    });

    if (error) throw new Error("The email outcome could not be recorded.");
  }
}
