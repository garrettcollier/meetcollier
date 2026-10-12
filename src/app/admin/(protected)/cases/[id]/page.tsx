import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminMfa } from "@/modules/administration/services/require-admin";
import { formatCaseDate, getCaseStatusLabel } from "@/modules/case-management/domain/case-labels";
import { getAssistanceCategoryLabel, type AssistanceCategory } from "@/modules/constituent-intake/domain/assistance-request";

export const instant = false;

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function AdminCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) notFound();

  const { userId } = await requireAdminMfa();
  const supabase = await createClient();
  const { data: caseRecord, error } = await supabase
    .from("cases")
    .select("id, reference_id, contact_id, category, subject, description, status, priority, source_context, next_follow_up_at, last_contact_at, official_service_reference, resolution_description, retention_status, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !caseRecord) notFound();

  const [{ data: contact }, { data: events }, { data: notes }] = await Promise.all([
    supabase.from("contacts").select("full_name, email, phone, preferred_contact_method, general_location").eq("id", caseRecord.contact_id).maybeSingle(),
    supabase.from("case_events").select("id, event_type, previous_status, new_status, created_at").eq("case_id", id).order("created_at", { ascending: false }).limit(100),
    supabase.from("case_notes").select("id, body, created_at").eq("case_id", id).order("created_at", { ascending: false }).limit(100),
  ]);

  const { error: auditError } = await supabase.from("audit_logs").insert({
    action: "CASE_VIEWED",
    actor_user_id: userId,
    entity_id: id,
    entity_type: "case",
    metadata: { reference_id: caseRecord.reference_id },
  });

  if (auditError) {
    throw new Error("Sensitive case access could not be audited.");
  }

  return (
    <main className="min-h-screen bg-warm-50 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-bold text-blue-700 underline underline-offset-4" href="/admin/cases">← All cases</Link>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Private case management</p>
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-navy-950 sm:text-5xl">{caseRecord.reference_id}</h1>
            <p className="mt-3 text-lg font-semibold text-navy-800">{caseRecord.subject}</p>
          </div>
          <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-900">{getCaseStatusLabel(caseRecord.status)}</span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-3xl border border-navy-900/10 bg-white p-6 sm:p-8" aria-labelledby="request-heading">
            <h2 className="font-serif text-3xl font-semibold text-navy-950" id="request-heading">Request</h2>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div><dt className="text-xs font-bold uppercase tracking-wide text-navy-600">Category</dt><dd className="mt-1 text-sm text-navy-950">{getAssistanceCategoryLabel(caseRecord.category as AssistanceCategory)}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wide text-navy-600">Received</dt><dd className="mt-1 text-sm text-navy-950">{formatCaseDate(caseRecord.created_at)}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wide text-navy-600">Priority</dt><dd className="mt-1 text-sm text-navy-950">{caseRecord.priority.toLowerCase()}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wide text-navy-600">Context</dt><dd className="mt-1 text-sm text-navy-950">{caseRecord.source_context === "official_constituent_service" ? "Official constituent service" : "Independent community platform"}</dd></div>
            </dl>
            <h3 className="mt-8 text-sm font-bold text-navy-950">Description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-navy-800">{caseRecord.description}</p>
            {caseRecord.official_service_reference ? <p className="mt-6 text-sm text-navy-800"><strong>Official reference:</strong> {caseRecord.official_service_reference}</p> : null}
          </section>

          <aside className="rounded-3xl border border-navy-900/10 bg-white p-6 sm:p-8" aria-labelledby="contact-heading">
            <h2 className="font-serif text-3xl font-semibold text-navy-950" id="contact-heading">Contact</h2>
            {contact ? (
              <dl className="mt-6 space-y-5 text-sm">
                <div><dt className="font-bold text-navy-950">Name</dt><dd className="mt-1 text-navy-700">{contact.full_name}</dd></div>
                {contact.email ? <div><dt className="font-bold text-navy-950">Email</dt><dd className="mt-1 break-all text-navy-700">{contact.email}</dd></div> : null}
                {contact.phone ? <div><dt className="font-bold text-navy-950">Phone</dt><dd className="mt-1 text-navy-700">{contact.phone}</dd></div> : null}
                <div><dt className="font-bold text-navy-950">Preference</dt><dd className="mt-1 capitalize text-navy-700">{contact.preferred_contact_method}</dd></div>
                {contact.general_location ? <div><dt className="font-bold text-navy-950">General location</dt><dd className="mt-1 text-navy-700">{contact.general_location}</dd></div> : null}
              </dl>
            ) : <p className="mt-5 text-sm text-red-800">Contact details could not be loaded.</p>}
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-navy-900/10 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-950">History</h2>
            <ol className="mt-5 space-y-4">
              {(events ?? []).map((event) => <li className="border-l-2 border-blue-200 pl-4 text-sm" key={event.id}><strong className="text-navy-950">{event.event_type.replaceAll("_", " ").toLowerCase()}</strong><span className="mt-1 block text-navy-600">{formatCaseDate(event.created_at)}</span></li>)}
              {(events ?? []).length === 0 ? <li className="text-sm text-navy-600">No history entries.</li> : null}
            </ol>
          </section>
          <section className="rounded-3xl border border-navy-900/10 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-950">Internal notes</h2>
            <div className="mt-5 space-y-4">
              {(notes ?? []).map((note) => <article className="rounded-xl bg-warm-50 p-4 text-sm leading-6 text-navy-800" key={note.id}><p className="whitespace-pre-wrap">{note.body}</p><p className="mt-2 text-xs text-navy-600">{formatCaseDate(note.created_at)}</p></article>)}
              {(notes ?? []).length === 0 ? <p className="text-sm text-navy-600">No internal notes.</p> : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
