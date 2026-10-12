import "server-only";

const requiredServerVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "ADMIN_NOTIFICATION_EMAIL",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "TURNSTILE_ALLOWED_HOSTNAMES",
  "INTAKE_HASH_SECRET",
] as const;

export function getMissingIntakeConfiguration() {
  return requiredServerVariables.filter((name) => !process.env[name]?.trim());
}

export function isIntakeConfigured() {
  return getMissingIntakeConfiguration().length === 0;
}
