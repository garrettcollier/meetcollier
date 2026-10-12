import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { PageIntro } from "@/components/public/page-intro";

export const metadata: Metadata = {
  title: "Priorities and Progress",
  description: "A transparent register of public-service priorities, commitments, milestones, and sources.",
  robots: { index: false, follow: false },
};

const principles = [
  "A commitment is not the same as an adopted policy.",
  "A referral is not the same as a resolution.",
  "Board, department, and community actions require clear attribution.",
] as const;

export default function PrioritiesPage() {
  return (
    <>
      <PageIntro eyebrow="Priorities and progress" title="Track commitments without overstating results."><p>Each published priority will show the problem, desired outcome, current status, next milestone, sources, personal action, and action requiring others.</p></PageIntro>
      <section className="bg-white py-16 sm:py-20"><div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-navy-900/10 bg-warm-50 p-8"><h2 className="font-serif text-3xl font-semibold text-navy-950">The register is ready for verified commitments.</h2><p className="mt-4 text-sm leading-6 text-navy-700">No commitment is published until its scope, owner, evidence, and status are clear.</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-700">No items published <ArrowRight aria-hidden="true" className="size-4" /></span></div>
        <div className="space-y-4">{principles.map((principle) => <div key={principle} className="flex gap-3 rounded-2xl border border-navy-900/10 p-5"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue-700" /><p className="text-sm leading-6 text-navy-800">{principle}</p></div>)}</div>
      </div></section>
    </>
  );
}
