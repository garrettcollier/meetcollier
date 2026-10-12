import { MessageCircleReply } from "lucide-react";

import { engagementConfig } from "@/lib/config/engagement";
import { cn } from "@/lib/utils";

type ResponseStandardProps = {
  className?: string;
};

export function ResponseStandard({ className }: ResponseStandardProps) {
  return (
    <section
      aria-labelledby="response-standard-heading"
      className={cn(
        "rounded-3xl border border-blue-700/20 bg-blue-50 p-6 text-navy-950 sm:p-7",
        className,
      )}
    >
      <div className="flex gap-4">
        <MessageCircleReply aria-hidden="true" className="mt-1 size-6 shrink-0 text-blue-700" />
        <div>
          <h2 className="text-xl font-bold" id="response-standard-heading">
            Response standard
          </h2>
          <p className="mt-2 text-sm leading-6">
            I aim to personally acknowledge non-emergency messages{" "}
            {engagementConfig.responseStandard.acknowledgmentWindow}, by email, text
            message, or phone call based on the contact method you prefer. An automatic
            reference email only confirms receipt; it does not mean the matter has been
            personally reviewed or resolved. Requests involving a City department or
            another agency may take longer.
          </p>
        </div>
      </div>
    </section>
  );
}
