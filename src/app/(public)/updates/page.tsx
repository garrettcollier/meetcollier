import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { PageIntro } from "@/components/public/page-intro";
import { StatusNotice } from "@/components/public/status-notice";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Public Updates",
  description: "Sourced community updates and meeting summaries.",
  robots: { index: false, follow: false },
};

export default function UpdatesPage() {
  return (
    <>
      <PageIntro eyebrow="Public updates" title="Context, sources, and plain-language explanations.">
        <p>Updates will identify what was proposed, what was decided, who acted, and which sources support the summary.</p>
      </PageIntro>
      <section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-4xl space-y-8 px-5 sm:px-8">
        {!siteConfig.capabilities.boardUpdates ? <StatusNotice>Board-update publishing is inactive in the current operating mode. The site will not imply that Garrett Collier participated in official Board action.</StatusNotice> : null}
        <div className="rounded-3xl border border-dashed border-navy-900/20 bg-warm-50 p-10 text-center"><FileText aria-hidden="true" className="mx-auto size-8 text-blue-700" /><h2 className="mt-5 text-2xl font-bold text-navy-950">No public updates are published yet.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-navy-700">Drafts will remain private until reviewed, sourced, previewed, and deliberately published.</p></div>
      </div></section>
    </>
  );
}
