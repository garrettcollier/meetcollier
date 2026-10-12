import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { publicNavigation, siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="border-b border-navy-900/10 bg-warm-50/95 backdrop-blur supports-[backdrop-filter]:bg-warm-50/85">
      <a
        className="sr-only rounded-sm bg-white px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
        href="#main-content"
      >
        Skip to main content
      </a>
      <div className="border-b border-navy-900/10 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-xs sm:px-8">
          <p>{siteConfig.modeLabel}</p>
          <p className="hidden text-white/70 sm:block">{siteConfig.disclosure}</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:py-6">
        <Link
          href="/"
          aria-label="Meet Collier home"
          className="rounded-sm text-xl font-extrabold tracking-[-0.06em] text-navy-950 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
        >
          {siteConfig.wordmark}
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm text-sm font-semibold text-navy-800 underline-offset-8 transition-colors hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 border-navy-900/20 px-5")}
          >
            Contact
          </Link>
          <Link
            href="/meet"
            className={cn(buttonVariants({ size: "lg" }), "h-11 bg-blue-700 px-5 text-white hover:bg-blue-800")}
          >
            Schedule a meeting
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-navy-900/15 bg-white text-navy-950 transition-colors hover:bg-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation menu</span>
            <Menu aria-hidden="true" className="size-5" />
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-14 z-40 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-navy-900/10 bg-white p-3 shadow-2xl shadow-navy-950/15"
          >
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-900 hover:bg-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-navy-900/10 pt-3">
              <Link
                href="/contact"
                className="block rounded-xl px-4 py-3 text-base font-semibold text-navy-900 hover:bg-warm-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                Contact
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
