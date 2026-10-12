import type { Metadata } from "next";

import { PageIntro } from "@/components/public/page-intro";

export const metadata: Metadata = { title: "Accessibility", description: "Meet Collier accessibility goals and accommodation channels." };

export default function AccessibilityPage() {
  return <><PageIntro eyebrow="Accessibility" title="Access is a requirement, not an add-on."><p>Meet Collier targets WCAG 2.2 Level AA and is designed for keyboard, screen-reader, zoom, reduced-motion, mobile, and clear-language use.</p></PageIntro><section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-4xl space-y-6 px-5 text-base leading-8 text-navy-700 sm:px-8"><p>The interface uses semantic structure, visible focus, descriptive labels, responsive layouts, accessible error messaging, and high-contrast colors. Third-party scheduling and event tools will be evaluated as part of launch readiness.</p><p>An accommodation request and accessibility-feedback contact will be published after the contact channel is verified. Residents unable to use an online form will have a phone or email alternative.</p><p><strong className="text-navy-950">Status:</strong> This statement is operational guidance pending a formal accessibility review and browser/assistive-technology testing.</p></div></section></>;
}
