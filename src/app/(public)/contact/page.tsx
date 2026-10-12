import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

import { PageIntro } from "@/components/public/page-intro";
import { ResponseStandard } from "@/components/public/response-standard";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Contact", description: "Contact Garrett Collier or find an alternate communication option." };

export default function ContactPage() {
  const { email, phone, phoneGuidance, phoneUri } = siteConfig.contact;

  return (
    <>
      <PageIntro eyebrow="Contact" title="Choose a comfortable way to connect."><p>Email, text, phone, scheduling, and accessibility-accommodation options are available from one place.</p></PageIntro>
      <section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-4xl space-y-8 px-5 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-3xl border border-navy-900/10 bg-warm-50 p-7">
            <Mail aria-hidden="true" className="size-6 text-blue-700" />
            <h2 className="mt-5 text-xl font-bold">Email</h2>
            <a className="mt-3 block break-all text-sm font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4 hover:text-blue-950" href={`mailto:${email}`}>{email}</a>
          </article>
          <article className="rounded-3xl border border-navy-900/10 bg-warm-50 p-7">
            <Phone aria-hidden="true" className="size-6 text-blue-700" />
            <h2 className="mt-5 text-xl font-bold">Text or call</h2>
            <a className="mt-3 block text-lg font-bold text-blue-800 underline decoration-blue-300 underline-offset-4 hover:text-blue-950" href={`sms:${phoneUri}`}>{phone}</a>
            <p className="mt-4 text-sm leading-6 text-navy-700">{phoneGuidance}</p>
            <a className="mt-4 inline-block text-sm font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4 hover:text-blue-950" href={`tel:${phoneUri}`}>Call instead</a>
          </article>
        </div>
        <ResponseStandard />
      </div></section>
    </>
  );
}
