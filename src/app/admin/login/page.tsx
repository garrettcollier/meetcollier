import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = { title: "Administrator Sign In", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-5 py-16 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <LockKeyhole aria-hidden="true" className="size-8 text-blue-400" />
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-blue-400">Private administration</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Secure sign in</h1>
        <p className="mt-4 text-sm leading-6 text-white/65">Administrative access requires a verified Supabase session and multi-factor authentication at AAL2.</p>
        {!configured ? (
          <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-5 text-sm leading-6 text-white/75">
            Authentication is not configured. Add the Supabase environment values before testing administrator sign in.
          </div>
        ) : null}
        <AdminLoginForm enabled={configured} />
        <Link href="/" className="mt-7 inline-flex rounded-sm text-sm font-bold text-blue-300 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Return to public website</Link>
      </div>
    </main>
  );
}
