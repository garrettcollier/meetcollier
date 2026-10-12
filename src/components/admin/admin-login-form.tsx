"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

type AdminLoginFormProps = {
  enabled: boolean;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 disabled:cursor-not-allowed disabled:opacity-60";

export function AdminLoginForm({ enabled }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMessage("The email or password was not accepted.");
        return;
      }

      const { data, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError) {
        setErrorMessage("Your identity was verified, but the MFA status could not be checked.");
        return;
      }

      router.replace(data.currentLevel === "aal2" ? "/admin" : "/admin/mfa");
      router.refresh();
    } catch {
      setErrorMessage("Secure sign in is temporarily unavailable.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-bold text-white" htmlFor="admin-email">
          Email
        </label>
        <input
          autoComplete="username"
          className={inputClassName}
          disabled={!enabled || isSubmitting}
          id="admin-email"
          inputMode="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <div>
        <label className="text-sm font-bold text-white" htmlFor="admin-password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className={inputClassName}
          disabled={!enabled || isSubmitting}
          id="admin-password"
          minLength={12}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      {errorMessage ? (
        <p className="rounded-xl border border-red-300/30 bg-red-950/40 p-4 text-sm text-red-100" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <Button
        className="h-11 w-full bg-blue-500 font-bold text-white hover:bg-blue-400"
        disabled={!enabled || isSubmitting}
        type="submit"
      >
        {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
        {isSubmitting ? "Signing in…" : "Sign in securely"}
      </Button>
    </form>
  );
}
