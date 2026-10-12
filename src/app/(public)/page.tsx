import { ArrowRight, CalendarDays, CircleHelp, Landmark, MapPinned, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ResponseStandard } from "@/components/public/response-standard";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

const primaryActions = [
  {
    title: "Schedule a meeting",
    description: "Reserve a 15-minute conversation using Garrett’s current Cal.com availability.",
    href: "/meet",
    icon: CalendarDays,
  },
  {
    title: "Request assistance",
    description: "Understand how the secure assistance process will work and where to get official help now.",
    href: "/help",
    icon: CircleHelp,
  },
  {
    title: "View upcoming events",
    description: "Find listening sessions, office hours, town halls, and community discussions.",
    href: "/events",
    icon: MapPinned,
  },
] as const;

const secondaryLinks = [
  { label: "Find civic resources", href: "/resources" },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-warm-50">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[38%] bg-navy-50 lg:block" />
        <div aria-hidden="true" className="absolute right-[12%] top-24 hidden size-72 rounded-full border border-blue-700/15 lg:block" />
        <div aria-hidden="true" className="absolute right-[8%] top-40 hidden size-72 rounded-full border border-blue-700/10 lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:min-h-[44rem] lg:grid-cols-[1.25fr_0.75fr] lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-navy-900/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-blue-700 shadow-sm">
              <span className="size-2 rounded-full bg-blue-600" />
              {siteConfig.tagline}
            </p>
            <h1 className="mt-8 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] tracking-[-0.055em] text-navy-950 sm:text-7xl lg:text-[5.8rem]">
              Your voice.<br />
              <span className="text-blue-700">Your community.</span><br />
              Your government.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-navy-700 sm:text-xl">
              {siteConfig.supportingCopy}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/meet"
                className={cn(buttonVariants({ size: "lg" }), "h-13 bg-blue-700 px-6 text-base text-white shadow-lg shadow-blue-700/15 hover:bg-blue-800")}
              >
                Schedule a meeting
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/help"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-13 border-navy-900/20 bg-white px-6 text-base")}
              >
                Request assistance
              </Link>
            </div>
          </div>

          <aside className="relative rounded-[2rem] border border-navy-900/10 bg-white p-7 shadow-2xl shadow-navy-950/10 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Current status</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-[-0.03em] text-navy-950">
              Built to be accurate before and after an election.
            </h2>
            <p className="mt-4 text-sm leading-6 text-navy-700">
              This platform is in {siteConfig.modeLabel.toLowerCase()} mode. Garrett Collier is not presented as a City officeholder, and official constituent-service features remain inactive.
            </p>
            <dl className="mt-7 space-y-5 border-t border-navy-900/10 pt-7">
              <div className="grid grid-cols-[6.5rem_1fr] gap-4">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-navy-600">Location</dt>
                <dd className="text-sm font-semibold text-navy-950">Hot Springs, Arkansas</dd>
              </div>
              <div className="grid grid-cols-[6.5rem_1fr] gap-4">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-navy-600">Focus</dt>
                <dd className="text-sm font-semibold text-navy-950">City Director District 5</dd>
              </div>
              <div className="grid grid-cols-[6.5rem_1fr] gap-4">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-navy-600">Timezone</dt>
                <dd className="text-sm font-semibold text-navy-950">Central Time</dd>
              </div>
              <div className="grid grid-cols-[6.5rem_1fr] gap-4">
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-navy-600">Office hours</dt>
                <dd className="text-sm font-semibold text-navy-950">
                  <Link className="text-blue-700 underline underline-offset-4" href="/meet#office-hours">Second and fourth Saturdays, 10:00 a.m.–12:00 p.m.</Link>
                  <span className="mt-1 block text-xs font-normal text-navy-600">San Francisco Bread Co</span>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ResponseStandard />
        </div>
      </section>

      <section aria-labelledby="connect-heading" className="bg-white py-18 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Start here</p>
            <h2 id="connect-heading" className="mt-4 font-serif text-4xl font-semibold tracking-[-0.04em] text-navy-950 sm:text-5xl">
              A clearer path to connection.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {primaryActions.map(({ title, description, href, icon: Icon }, index) => (
              <Link
                key={href}
                href={href}
                className="group rounded-3xl border border-navy-900/10 bg-warm-50 p-7 outline-none transition duration-200 hover:-translate-y-1 hover:border-blue-700/30 hover:shadow-xl hover:shadow-navy-950/8 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-navy-950 text-white">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-navy-600">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-xl font-bold tracking-[-0.02em] text-navy-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-navy-700">{description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                  Learn more
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-18 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Designed around trust</p>
            <h2 className="mt-5 font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Public information stays public. Personal information stays protected.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              [ShieldCheck, "Privacy by default", "Case details will remain server-controlled and unavailable from public reference IDs."],
              [Landmark, "Accurate authority", "The site changes language and capabilities based on verified office status."],
              [CircleHelp, "Clear boundaries", "Independent requests remain separate from official City work orders and agency action."],
              [CircleHelp, "Accessible service", "Multiple contact paths will support residents who cannot use online scheduling."],
            ].map(([Icon, title, copy]) => {
              const FeatureIcon = Icon as typeof ShieldCheck;
              return (
                <div key={title as string} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <FeatureIcon aria-hidden="true" className="size-6 text-blue-400" />
                  <h3 className="mt-5 font-bold">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{copy as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-warm-100 py-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Useful information</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em] text-navy-950">
              Find the right public resource.
            </h2>
          </div>
          <nav aria-label="More ways to explore" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {secondaryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center justify-between gap-3 rounded-full border border-navy-900/15 bg-white px-5 py-3 text-sm font-bold text-navy-900 transition-colors hover:border-blue-700/40 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {item.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
