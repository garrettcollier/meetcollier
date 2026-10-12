import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireAdminMfa() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!configured) {
    redirect("/admin/login?reason=configuration-required");
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    redirect("/admin/login?reason=sign-in-required");
  }

  const { data: assuranceData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (assuranceData?.currentLevel !== "aal2") {
    redirect("/admin/mfa");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", claimsData.claims.sub)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    redirect("/admin/login?reason=not-authorized");
  }

  return { role: admin.role, userId: claimsData.claims.sub };
}
