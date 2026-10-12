import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getAdminAccessDecision } from "@/modules/administration/domain/access";

function redirectTo(request: NextRequest, pathname: string, reason?: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = reason ? `?reason=${encodeURIComponent(reason)}` : "";
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/mfa") {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const configured = Boolean(url && publishableKey);

  if (!configured) {
    return redirectTo(request, "/admin/login", "configuration-required");
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url!, publishableKey!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headersToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headersToSet).forEach(([key, value]) =>
          response.headers.set(key, value),
        );
      },
    },
  });

  const { data: claimsData } = await supabase.auth.getClaims();
  const hasVerifiedIdentity = Boolean(claimsData?.claims?.sub);
  const { data: assuranceData } = hasVerifiedIdentity
    ? await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    : { data: null };

  const decision = getAdminAccessDecision({
    configured,
    hasVerifiedIdentity,
    assuranceLevel:
      assuranceData?.currentLevel === "aal2"
        ? "aal2"
        : assuranceData?.currentLevel === "aal1"
          ? "aal1"
          : null,
  });

  if (decision === "SIGN_IN_REQUIRED") {
    return redirectTo(request, "/admin/login", "sign-in-required");
  }

  if (decision === "MFA_REQUIRED") {
    return redirectTo(request, "/admin/mfa");
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
