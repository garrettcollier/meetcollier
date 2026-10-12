import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { AdminMfaForm } from "@/components/admin/admin-mfa-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "MFA Required", robots: { index: false, follow: false } };

export default async function AdminMfaPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!configured) redirect("/admin/login?reason=configuration-required");

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/admin/login?reason=sign-in-required");

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-5 py-16 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <ShieldCheck aria-hidden="true" className="size-8 text-blue-400" />
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Additional verification</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold">MFA is required.</h1>
        <p className="mt-4 text-sm leading-6 text-white/65">
          Administrative records remain unavailable until a time-based authentication code is verified.
        </p>
        <AdminMfaForm />
      </div>
    </main>
  );
}
