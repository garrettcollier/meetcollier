import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function PageIntro({ eyebrow, title, children, actions }: PageIntroProps) {
  return (
    <section className="border-b border-navy-900/10 bg-warm-50">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-navy-950 sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <div className="mt-7 max-w-3xl text-lg leading-8 text-navy-700 sm:text-xl">{children}</div>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
