import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Records", href: "/records" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:py-20">
        <div>
          <p className="text-xl font-extrabold tracking-[-0.06em]">{siteConfig.wordmark}</p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">{siteConfig.disclosure}</p>
          <address className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm not-italic">
            <a className="rounded-sm text-white/85 underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" href={`sms:${siteConfig.contact.phoneUri}`}>Text {siteConfig.contact.phone}</a>
            <a className="rounded-sm break-all text-white/85 underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          </address>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            Information on this site does not replace emergency services or an official City service request.
            Call 911 in an emergency.
          </p>
        </div>
        <div className="lg:justify-self-end">
          <nav aria-label="Footer navigation" className="flex max-w-md flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-8 text-xs leading-5 text-white/50">
            © 2026 Garrett Collier. Built for accessibility, privacy, and accountable public service.
          </p>
        </div>
      </div>
    </footer>
  );
}
