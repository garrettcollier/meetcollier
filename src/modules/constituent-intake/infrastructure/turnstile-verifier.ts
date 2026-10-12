import "server-only";

import type { BotVerifier } from "@/modules/constituent-intake/services/intake-ports";

type TurnstileResponse = {
  action?: string;
  hostname?: string;
  success?: boolean;
};

export class TurnstileVerifier implements BotVerifier {
  async verify({ remoteIp, token }: { remoteIp?: string; token: string }) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    const allowedHostnames = new Set(
      (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
        .split(",")
        .map((hostname) => hostname.trim())
        .filter(Boolean),
    );

    if (!secret || allowedHostnames.size === 0 || token.length > 2048) {
      return false;
    }

    try {
      const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret,
            response: token,
            ...(remoteIp ? { remoteip: remoteIp } : {}),
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        },
      );

      if (!response.ok) return false;
      const result = (await response.json()) as TurnstileResponse;

      return Boolean(
        result.success &&
          result.action === "assistance_intake" &&
          result.hostname &&
          allowedHostnames.has(result.hostname),
      );
    } catch {
      return false;
    }
  }
}
