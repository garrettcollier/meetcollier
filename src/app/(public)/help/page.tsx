import type { Metadata } from "next";
import { AlertTriangle, ExternalLink, LockKeyhole } from "lucide-react";

import { AssistanceForm } from "@/components/assistance/assistance-form";
import { PageIntro } from "@/components/public/page-intro";
import { ResponseStandard } from "@/components/public/response-standard";
import { StatusNotice } from "@/components/public/status-notice";
import { siteConfig } from "@/lib/config/site";
import { isIntakeConfigured } from "@/modules/constituent-intake/services/intake-configuration";

export const metadata: Metadata = {
  title: "Get Help",
  description: "Request help or find the appropriate City of Hot Springs service channel.",
};

export default function HelpPage() {
  const intakeConfigured = isIntakeConfigured();
  const independentMode = siteConfig.operatingMode !== "IN_OFFICE";

  return (
    <>
      <PageIntro eyebrow="Get help" title="Start with the right path for help.">
        <p>This independent platform is being designed to receive the minimum information needed to respond while keeping personal case details private.</p>
      </PageIntro>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-7 px-5 sm:px-8">
          <div className="flex gap-4 rounded-3xl border border-red-700/20 bg-red-50 p-6 text-red-950">
            <AlertTriangle aria-hidden="true" className="mt-1 size-6 shrink-0 text-red-700" />
            <div>
              <h2 className="font-bold">For emergencies, call 911.</h2>
              <p className="mt-2 text-sm leading-6">Do not use this website for an active emergency, immediate danger, or time-sensitive public-safety report.</p>
            </div>
          </div>
          {independentMode ? (
            <StatusNotice>
              <strong>This is an independent community-help channel.</strong> Garrett Collier is not presented as a City officeholder, cannot direct City departments through this platform, and cannot guarantee an official response or outcome.
            </StatusNotice>
          ) : null}
          <ResponseStandard />
          {!intakeConfigured ? (
            <StatusNotice>
              <strong>Submissions are disabled until the secure services are configured.</strong> The form is visible for review, but it will not collect information or claim success before the private database, email, rate-limit, and bot-protection settings are ready.
            </StatusNotice>
          ) : null}
          <AssistanceForm
            enabled={intakeConfigured}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
          />
          <div className="rounded-3xl border border-navy-900/10 bg-warm-50 p-7 sm:p-9">
            <LockKeyhole aria-hidden="true" className="size-7 text-blue-700" />
            <h2 className="mt-5 font-serif text-3xl font-semibold text-navy-950">Official requests remain official.</h2>
            <p className="mt-4 text-sm leading-6 text-navy-700">
              A submission here will not automatically create a City work order. Use official City channels for service requests that require a department response or tracking number.
            </p>
            <a
              href="https://www.hotspringsar.gov/264/Contact"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-sm text-sm font-bold text-blue-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              City of Hot Springs contact directory <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
