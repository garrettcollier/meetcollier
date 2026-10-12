import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getAssistanceCategoryLabel, type AssistanceCategory } from "@/modules/constituent-intake/domain/assistance-request";
import { formatCaseDate, getCaseStatusLabel } from "@/modules/case-management/domain/case-labels";

export const instant = false;

type SearchParams = Promise<{ category?: string; q?: string; status?: string }>;

export default async function AdminCasesPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("cases")
    .select("id, reference_id, category, subject, status, priority, created_at, next_follow_up_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.category) query = query.eq("category", filters.category);

  const { data, error } = await query;
  const normalizedSearch = filters.q?.trim().toLocaleLowerCase("en-US") ?? "";
  const cases = (data ?? []).filter((item) =>
    normalizedSearch
      ? item.reference_id.toLocaleLowerCase("en-US").includes(normalizedSearch) ||
        item.subject.toLocaleLowerCase("en-US").includes(normalizedSearch)
      : true,
  );

  return (
    <main className="min-h-screen bg-warm-50 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Private case management</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-serif text-5xl font-semibold text-navy-950">Cases</h1>
            <p className="mt-3 text-sm text-navy-700">Most recent 100 records. Personal details appear only on the protected case page.</p>
          </div>
          <Link className="text-sm font-bold text-blue-700 underline underline-offset-4" href="/admin">Dashboard</Link>
        </div>

        <form className="mt-8 grid gap-3 rounded-2xl border border-navy-900/10 bg-white p-4 sm:grid-cols-[1fr_auto]" method="get">
          <label className="sr-only" htmlFor="case-search">Search by reference or subject</label>
          <input
            className="rounded-xl border border-navy-900/20 px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            defaultValue={filters.q}
            id="case-search"
            name="q"
            placeholder="Search reference or subject"
          />
          <button className="rounded-xl bg-navy-950 px-5 py-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" type="submit">Search</button>
        </form>

        {error ? (
          <p className="mt-7 rounded-2xl border border-red-700/20 bg-red-50 p-5 text-sm font-semibold text-red-900" role="alert">Cases could not be loaded.</p>
        ) : null}

        {!error && cases.length === 0 ? (
          <p className="mt-7 rounded-2xl border border-navy-900/10 bg-white p-7 text-navy-700">No matching cases.</p>
        ) : null}

        {cases.length > 0 ? (
          <div className="mt-7 overflow-x-auto rounded-2xl border border-navy-900/10 bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <caption className="sr-only">Private assistance cases</caption>
              <thead className="bg-navy-950 text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold" scope="col">Reference</th>
                  <th className="px-5 py-4 font-semibold" scope="col">Subject</th>
                  <th className="px-5 py-4 font-semibold" scope="col">Category</th>
                  <th className="px-5 py-4 font-semibold" scope="col">Status</th>
                  <th className="px-5 py-4 font-semibold" scope="col">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/10">
                {cases.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4 font-mono font-semibold">
                      <Link className="text-blue-700 underline underline-offset-4" href={`/admin/cases/${item.id}`}>{item.reference_id}</Link>
                    </td>
                    <td className="max-w-sm px-5 py-4 font-semibold text-navy-950">{item.subject}</td>
                    <td className="px-5 py-4 text-navy-700">{getAssistanceCategoryLabel(item.category as AssistanceCategory)}</td>
                    <td className="px-5 py-4 text-navy-700">{getCaseStatusLabel(item.status)}</td>
                    <td className="px-5 py-4 text-navy-700">{formatCaseDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </main>
  );
}
