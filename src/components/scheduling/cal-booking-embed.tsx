"use client";

import Cal from "@calcom/embed-react";

type CalBookingEmbedProps = {
  calLink: string;
};

export function CalBookingEmbed({ calLink }: CalBookingEmbedProps) {
  return (
    <div className="min-h-[680px] overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-[0_24px_80px_rgba(16,35,63,0.08)] [&_iframe]:min-h-[680px] [&_iframe]:w-full">
      <Cal
        calLink={calLink}
        config={{ layout: "month_view", theme: "light" }}
        className="min-h-[680px] w-full"
      />
    </div>
  );
}
