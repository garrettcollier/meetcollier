"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

type MfaMode = "loading" | "enroll" | "challenge" | "error";

type Enrollment = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export function AdminMfaForm() {
  const router = useRouter();
  const initializationStarted = useRef(false);
  const [mode, setMode] = useState<MfaMode>("loading");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initializationStarted.current) return;
    initializationStarted.current = true;

    async function initialize() {
      try {
        const supabase = createClient();
        const { data: assurance, error: assuranceError } =
          await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        if (assuranceError) throw assuranceError;
        if (assurance.currentLevel === "aal2") {
          router.replace("/admin");
          router.refresh();
          return;
        }

        const { data: factors, error: factorsError } =
          await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;

        const verifiedFactor = factors.totp[0];
        if (verifiedFactor) {
          setFactorId(verifiedFactor.id);
          setMode("challenge");
          return;
        }

        const { data: enrolled, error: enrollmentError } = await supabase.auth.mfa.enroll({
          factorType: "totp",
          friendlyName: "Meet Collier administration",
        });
        if (enrollmentError) throw enrollmentError;

        setEnrollment({
          factorId: enrolled.id,
          qrCode: enrolled.totp.qr_code,
          secret: enrolled.totp.secret,
        });
        setFactorId(enrolled.id);
        setMode("enroll");
      } catch {
        setErrorMessage("MFA setup could not be loaded. Sign in again and retry.");
        setMode("error");
      }
    }

    void initialize();
  }, [router]);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!factorId || isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        code,
        factorId,
      });

      if (error) {
        setErrorMessage("That authentication code was not accepted. Check the six-digit code and try again.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setErrorMessage("The authentication code could not be verified.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (mode === "loading") {
    return (
      <p className="mt-7 flex items-center gap-3 text-sm text-white/70" role="status">
        <LoaderCircle aria-hidden="true" className="animate-spin" /> Preparing secure verification…
      </p>
    );
  }

  if (mode === "error") {
    return (
      <div className="mt-7">
        <p className="rounded-xl border border-red-300/30 bg-red-950/40 p-4 text-sm text-red-100" role="alert">
          {errorMessage}
        </p>
        <Link className="mt-5 inline-flex text-sm font-bold text-blue-300 underline underline-offset-4" href="/admin/login">
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-7">
      {mode === "enroll" && enrollment ? (
        <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
          <h2 className="font-bold text-white">Set up an authenticator app</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Scan this QR code with a trusted authenticator app. Store the manual key securely; it grants access to the second factor.
          </p>
          <div className="mt-5 w-fit rounded-xl bg-white p-3">
            <Image
              alt="QR code for Meet Collier administrator MFA enrollment"
              height={224}
              src={enrollment.qrCode}
              unoptimized
              width={224}
            />
          </div>
          <details className="mt-4 text-sm text-white/70">
            <summary className="cursor-pointer font-semibold text-blue-300">Use a manual setup key</summary>
            <code className="mt-3 block break-all rounded-lg bg-black/30 p-3 text-xs text-white">
              {enrollment.secret}
            </code>
          </details>
        </div>
      ) : (
        <p className="text-sm leading-6 text-white/70">
          Enter the current six-digit code from your authenticator app.
        </p>
      )}

      <form className="mt-6" onSubmit={handleVerify}>
        <label className="text-sm font-bold text-white" htmlFor="mfa-code">
          Six-digit authentication code
        </label>
        <input
          autoComplete="one-time-code"
          className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-mono text-lg tracking-[0.3em] text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
          id="mfa-code"
          inputMode="numeric"
          maxLength={6}
          minLength={6}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          pattern="[0-9]{6}"
          required
          value={code}
        />
        {errorMessage ? (
          <p className="mt-4 rounded-xl border border-red-300/30 bg-red-950/40 p-4 text-sm text-red-100" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <Button
          className="mt-5 h-11 w-full bg-blue-500 font-bold text-white hover:bg-blue-400"
          disabled={code.length !== 6 || isSubmitting}
          type="submit"
        >
          {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
          {isSubmitting ? "Verifying…" : mode === "enroll" ? "Enable MFA" : "Verify and continue"}
        </Button>
      </form>
    </div>
  );
}
