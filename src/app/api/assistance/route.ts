import { type NextRequest, NextResponse } from "next/server";

import { siteConfig } from "@/lib/config/site";
import { assistanceRequestSchema } from "@/modules/constituent-intake/domain/assistance-request";
import {
  BotVerificationError,
  DuplicateIntakeError,
  IntakeConfigurationError,
  IntakeRateLimitedError,
} from "@/modules/constituent-intake/domain/intake-errors";
import { ResendIntakeNotifier } from "@/modules/constituent-intake/infrastructure/resend-intake-notifier";
import { TurnstileVerifier } from "@/modules/constituent-intake/infrastructure/turnstile-verifier";
import { SupabaseIntakeRepository } from "@/modules/constituent-intake/repositories/supabase-intake-repository";
import { isIntakeConfigured } from "@/modules/constituent-intake/services/intake-configuration";
import { submitAssistanceRequest } from "@/modules/constituent-intake/services/submit-assistance-request";

const responseHeaders = { "Cache-Control": "no-store" };

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const allowedOrigins = new Set([request.nextUrl.origin, siteConfig.siteUrl]);
  return allowedOrigins.has(origin);
}

function getRemoteIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || undefined;
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { message: "The request origin could not be verified." },
      { status: 403, headers: responseHeaders },
    );
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json(
      { message: "The request format is not supported." },
      { status: 415, headers: responseHeaders },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 24_000) {
    return NextResponse.json(
      { message: "The request is too large." },
      { status: 413, headers: responseHeaders },
    );
  }

  if (!isIntakeConfigured()) {
    return NextResponse.json(
      { message: "Online assistance is temporarily unavailable. Please use the contact options provided." },
      { status: 503, headers: responseHeaders },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "The submitted form could not be read." },
      { status: 400, headers: responseHeaders },
    );
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.length > 0
  ) {
    return NextResponse.json(
      { referenceId: "Submitted" },
      { status: 201, headers: responseHeaders },
    );
  }

  const parsed = assistanceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        fieldErrors: parsed.error.flatten().fieldErrors,
        message: "Review the highlighted fields and try again.",
      },
      { status: 422, headers: responseHeaders },
    );
  }

  try {
    const createdCase = await submitAssistanceRequest(
      parsed.data,
      {
        hashSecret: process.env.INTAKE_HASH_SECRET!,
        remoteIp: getRemoteIp(request),
        sourceContext:
          siteConfig.operatingMode === "IN_OFFICE"
            ? "official_constituent_service"
            : "independent_community_platform",
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
      {
        botVerifier: new TurnstileVerifier(),
        notifier: new ResendIntakeNotifier(),
        repository: new SupabaseIntakeRepository(),
      },
    );

    return NextResponse.json(
      { referenceId: createdCase.referenceId },
      { status: 201, headers: responseHeaders },
    );
  } catch (error) {
    if (error instanceof DuplicateIntakeError) {
      return NextResponse.json(
        { message: error.message },
        { status: 409, headers: responseHeaders },
      );
    }
    if (error instanceof IntakeRateLimitedError) {
      return NextResponse.json(
        { message: error.message },
        { status: 429, headers: { ...responseHeaders, "Retry-After": "3600" } },
      );
    }
    if (error instanceof BotVerificationError) {
      return NextResponse.json(
        { message: "The security check expired or could not be verified. Please try again." },
        { status: 403, headers: responseHeaders },
      );
    }
    if (error instanceof IntakeConfigurationError) {
      return NextResponse.json(
        { message: "Online assistance is temporarily unavailable. Please use the contact options provided." },
        { status: 503, headers: responseHeaders },
      );
    }

    return NextResponse.json(
      { message: "Your request could not be submitted. No confirmation should be assumed." },
      { status: 500, headers: responseHeaders },
    );
  }
}
