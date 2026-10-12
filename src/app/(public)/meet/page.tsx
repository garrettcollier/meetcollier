import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, Mail } from "lucide-react";

import { PageIntro } from "@/components/public/page-intro";
import { CalBookingEmbed } from "@/components/scheduling/cal-booking-embed";
import { StatusNotice } from "@/components/public/status-notice";
import { engagementConfig } from "@/lib/config/engagement";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Schedule a Meeting",
  description: "Choose how you would like to meet with Garrett Collier in Hot Springs, Arkansas.",
};

export default function MeetPage() {
  const { email, phone, phoneGuidance, phoneUri } = siteConfig.contact;
  const { bookingUrl, calLink, durationMinutes } = siteConfig.scheduling;

  return (
    <>
      <PageIntro eyebrow="Meet with Garrett" title="Choose the conversation that works for you.">
        <p>
          Reserve a {durationMinutes}-minute conversation using the live Cal.com calendar below. Available times are shown in your timezone, and private calendar details are never displayed.
        </p>
      </PageIntro>
      <section className="bg-warm-50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <section className="mb-8 rounded-3xl border border-navy-900/10 bg-white p-7 sm:p-9" id="office-hours" aria-labelledby="office-hours-heading">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">Community office hours</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
              <div>
                <h2 className="font-serif text-3xl font-semibold text-navy-950 sm:text-4xl" id="office-hours-heading">{engagementConfig.officeHours.cadence}</h2>
                <p className="mt-3 text-xl font-semibold text-navy-950">{engagementConfig.officeHours.startTime}–{engagementConfig.officeHours.endTime} <span className="text-sm font-normal text-navy-600">{engagementConfig.officeHours.timezone}</span></p>
                <p className="mt-4 text-base font-bold text-navy-950">{engagementConfig.officeHours.venueName}</p>
                <p className="mt-1 text-sm leading-6 text-navy-700">{engagementConfig.officeHours.venueAddress}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                  <a className="text-blue-700 underline underline-offset-4" href={engagementConfig.officeHours.venueMapUrl} rel="noreferrer" target="_blank">Get directions</a>
                  <a className="text-blue-700 underline underline-offset-4" href={engagementConfig.officeHours.venueWebsiteUrl} rel="noreferrer" target="_blank">Venue website</a>
                </div>
              </div>
              <StatusNotice>
                These are independent community office hours in a public dining space. Meet Collier is not affiliated with or sponsored by San Francisco Bread Co, and seating is not reserved. Schedule changes will be posted on the Events page.
              </StatusNotice>
            </div>
          </section>
          <div className="mb-12 rounded-3xl bg-navy-950 p-7 text-white sm:p-9">
            <Mail aria-hidden="true" className="size-6 text-blue-400" />
            <h2 className="mt-5 font-serif text-3xl font-semibold">Text or email Garrett</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              You do not have to use the online scheduler. Texting is preferred, or send an email to arrange a conversation.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
              <a className="rounded-sm text-blue-300 underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" href={`sms:${phoneUri}`}>Text {phone}</a>
              <a className="rounded-sm text-blue-300 underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" href={`mailto:${email}`}>Email Garrett</a>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70">{phoneGuidance}</p>
          </div>
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CalendarDays aria-hidden="true" className="size-7 text-blue-700" />
              <h2 className="mt-4 font-serif text-3xl font-semibold text-navy-950 sm:text-4xl">Book a {durationMinutes}-minute meeting</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-navy-700">The calendar reflects Garrett’s current availability and prevents conflicts automatically.</p>
            </div>
            <a className="inline-flex w-fit items-center gap-2 rounded-full border border-navy-900/15 bg-white px-5 py-3 text-sm font-bold text-navy-950 transition-colors hover:border-blue-700 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4" href={bookingUrl} rel="noreferrer" target="_blank">
              Open in Cal.com <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <CalBookingEmbed calLink={calLink} />
          <p className="mt-4 text-xs leading-5 text-navy-600">The booking form is provided by Cal.com. If the embedded calendar does not load, use the “Open in Cal.com” link above.</p>
        </div>
      </section>
    </>
  );
}
