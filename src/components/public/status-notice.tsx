import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function StatusNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-blue-700/20 bg-blue-50 p-5 text-sm leading-6 text-navy-800">
      <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-blue-700" />
      <div>{children}</div>
    </div>
  );
}
