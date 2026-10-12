import type { Metadata } from "next";

import { PageIntro } from "@/components/public/page-intro";
import { StatusNotice } from "@/components/public/status-notice";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "About", description: "About Garrett Collier and the purpose of Meet Collier." };

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About" title="Public service should feel close enough to reach."><p>Meet Collier is a long-term platform for accessible conversation, careful follow-through, and transparent public information in Hot Springs.</p></PageIntro>
      <section className="bg-white py-16 sm:py-20"><div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="rounded-3xl bg-navy-950 p-8 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Current role</p><p className="mt-4 font-serif text-3xl font-semibold">{siteConfig.publicRole}</p><p className="mt-3 text-sm leading-6 text-white/65">{siteConfig.city}, {siteConfig.state}</p></aside>
        <div className="space-y-6 text-base leading-8 text-navy-700"><p>The platform is intentionally separate from the City of Hot Springs and from campaign systems. It is designed to remain truthful whether Garrett holds office, is in transition, is a private citizen, or is preserving an archive from prior public service.</p><p>A verified biography, professional background, and public-service philosophy will be published here after owner review. The application will not infer or embellish biographical claims.</p><StatusNotice>The current pre-election mode does not display an officeholder title or imply City authority.</StatusNotice></div>
      </div></section>
    </>
  );
}
