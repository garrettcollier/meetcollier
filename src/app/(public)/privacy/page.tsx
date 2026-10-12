import type { Metadata } from "next";

import { PageIntro } from "@/components/public/page-intro";

export const metadata: Metadata = { title: "Privacy", description: "How Meet Collier will collect, use, protect, and retain personal information." };

const sections = [
  ["Minimum collection", "The Get Help form requests a name, at least one reply method, a preferred contact method, a category, a subject, a description, and a privacy acknowledgment. General location and an existing official service reference are optional."],
  ["Purpose limitation", "Constituent contacts will not be transferred into campaign systems, used for voter targeting, or added to campaign mailing lists."],
  ["Sensitive information", "Private case details remain server-controlled and are not included in analytics, routine application logs, or transactional email. Email notices contain a case reference and safety disclosures only."],
  ["Service providers", "Supabase is designed to store private case records, Resend to deliver transactional notices, and Cloudflare Turnstile to reduce automated abuse. These services are not activated until their accounts, terms, and privacy settings are reviewed."],
  ["Abuse prevention", "The server verifies a short-lived bot-protection token and uses keyed hashes for rate and duplicate controls. Raw IP addresses and browser user-agent strings are not stored in the case database."],
  ["Retention and records", "Retention rules will be configurable and will not be activated until reviewed for Arkansas public-records and applicable municipal requirements."],
] as const;

export default function PrivacyPage() {
  return <><PageIntro eyebrow="Privacy" title="Personal information deserves careful handling."><p>This is a pre-launch notice describing the platform’s intended controls. A legally reviewed policy must replace it before live constituent intake.</p></PageIntro><section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-4xl space-y-5 px-5 sm:px-8">{sections.map(([title, copy]) => <article key={title} className="rounded-2xl border border-navy-900/10 p-6"><h2 className="text-lg font-bold text-navy-950">{title}</h2><p className="mt-2 text-sm leading-6 text-navy-700">{copy}</p></article>)}</div></section></>;
}
