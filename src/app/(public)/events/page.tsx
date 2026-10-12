import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

import { PageIntro } from "@/components/public/page-intro";
import { engagementConfig } from "@/lib/config/engagement";

export const metadata: Metadata = {
  title: "Events",
  description: "Town halls, listening sessions, office hours, and community events in Hot Springs.",
};

export default function EventsPage() {
  return (
    <>
      <PageIntro eyebrow="Office hours and events" title="Meet regularly. Gather monthly.">
        <p>Community office hours provide a dependable twice-monthly time to talk. Larger community events, beginning with a planned monthly town hall, will be listed here as details are confirmed.</p>
      </PageIntro>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-navy-900/10 bg-warm-50 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Community office hours</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-navy-950">{engagementConfig.officeHours.cadence}</h2>
              <p className="mt-3 text-lg font-semibold text-navy-950">{engagementConfig.officeHours.startTime}–{engagementConfig.officeHours.endTime}</p>
              <p className="mt-3 text-sm leading-6 text-navy-700">{engagementConfig.officeHours.venueName}<br />{engagementConfig.officeHours.venueAddress}</p>
              <Link className="mt-5 inline-flex text-sm font-bold text-blue-700 underline underline-offset-4" href="/meet#office-hours">Office-hours details</Link>
            </article>
            <article className="rounded-3xl border border-navy-900/10 bg-blue-50 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Planned monthly town hall</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-navy-950">{engagementConfig.townHall.cadence}</h2>
              <p className="mt-3 text-lg font-semibold text-navy-950">{engagementConfig.townHall.startTime} {engagementConfig.townHall.timezone}</p>
              <p className="mt-3 text-sm leading-6 text-navy-700">Venue to be confirmed. These independent community gatherings are not official Board meetings.</p>
            </article>
          </div>

          <div className="mt-12">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Confirmed events</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-navy-950">Upcoming gatherings</h2>
          </div>
          <div className="mt-6 rounded-3xl border border-dashed border-navy-900/20 bg-warm-50 p-10 text-center">
            <CalendarDays aria-hidden="true" className="mx-auto size-8 text-blue-700" />
            <h3 className="mt-5 text-2xl font-bold text-navy-950">No events are published yet.</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-navy-700">The recurring schedule expresses the intent; only confirmed public events will appear here. Each listing will include time zone, location, map, accessibility information, RSVP status, and a calendar download. Any change or cancellation will be posted on the event listing.</p>
            <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-navy-600"><MapPin aria-hidden="true" className="size-4" /> Venue pending confirmation</p>
          </div>
        </div>
      </section>
    </>
  );
}
