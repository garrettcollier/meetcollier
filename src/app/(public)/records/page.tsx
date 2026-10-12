import type { Metadata } from "next";

import { PageIntro } from "@/components/public/page-intro";
import { StatusNotice } from "@/components/public/status-notice";

export const metadata: Metadata = { title: "Records and Retention", description: "How Meet Collier prepares to retain, search, export, and review public-service records." };

export default function RecordsPage() {
  return <><PageIntro eyebrow="Records and retention" title="Preserve first. Determine access lawfully."><p>The system is designed so records related to public business can be retained, searched, exported, reviewed, and disclosed or withheld only after a proper determination.</p></PageIntro><section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-4xl space-y-7 px-5 text-base leading-8 text-navy-700 sm:px-8"><StatusNotice>Arkansas FOIA may apply to official-business records even when they are held on a private system. This site does not make legal determinations about exemptions or retention periods.</StatusNotice><p>Public website content, constituent-service data, administrative records, campaign activity, and private business data must remain separate. Records will not be automatically deleted because the owner changes roles or offices.</p><p>Retention schedules, legal holds, redaction steps, and export procedures remain disabled or marked pending until legal and municipal-policy review is complete.</p></div></section></>;
}
