import { notFound } from "next/navigation";

export const instant = false;

const sections = new Set(["cases", "appointments", "events", "updates", "priorities", "resources", "reports", "audit", "settings"]);

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sections.has(section)) notFound();
  const title = section.charAt(0).toUpperCase() + section.slice(1);
  return <main className="min-h-screen bg-warm-50 px-5 py-16"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Private administration</p><h1 className="mt-4 font-serif text-5xl font-semibold text-navy-950">{title}</h1><p className="mt-5 max-w-2xl text-navy-700">This protected module route is reserved for its staged implementation. It does not expose private records or mock data.</p></div></main>;
}
