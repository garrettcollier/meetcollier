import "server-only";

import { Resend } from "resend";

import { IntakeConfigurationError } from "@/modules/constituent-intake/domain/intake-errors";
import type { IntakeNotifier } from "@/modules/constituent-intake/services/intake-ports";

export class ResendIntakeNotifier implements IntakeNotifier {
  private getConfiguration() {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL;
    const replyTo = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

    if (!apiKey || !from || !adminRecipient) {
      throw new IntakeConfigurationError();
    }

    return { adminRecipient, apiKey, from, replyTo };
  }

  async sendAdminNotification({ referenceId }: { referenceId: string }) {
    const { adminRecipient, apiKey, from, replyTo } = this.getConfiguration();
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: adminRecipient,
      ...(replyTo ? { replyTo } : {}),
      subject: `New Meet Collier help request ${referenceId}`,
      text: [
        "A new help request was received through Meet Collier.",
        "",
        `Reference: ${referenceId}`,
        "",
        "Sign in to the private administration portal to review and respond.",
        "Sensitive request details are intentionally excluded from this email.",
      ].join("\n"),
    });

    if (error) throw new Error("Administrative notification delivery failed.");
  }

  async sendAcknowledgment({
    recipient,
    referenceId,
  }: {
    recipient: string;
    referenceId: string;
  }) {
    const { apiKey, from, replyTo } = this.getConfiguration();
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: recipient,
      ...(replyTo ? { replyTo } : {}),
      subject: `Meet Collier received your request — ${referenceId}`,
      text: [
        "Your message was received.",
        "",
        `Reference: ${referenceId}`,
        "",
        "This independent platform is not the official City of Hot Springs website, and this submission does not automatically create a City work order.",
        "Call 911 for an emergency.",
        "",
        "Please do not reply with sensitive personal information.",
      ].join("\n"),
    });

    if (error) throw new Error("Acknowledgment delivery failed.");
  }
}
