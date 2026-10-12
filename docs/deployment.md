# Vercel deployment

Deployment has not been performed or authorized.

1. Connect the GitHub repository to a Vercel project.
2. Set the production framework preset to Next.js and use the repository's `npm run build` command.
3. Create separate Supabase projects or isolated schemas for preview and production. Never point branch previews at live constituent data.
4. Add every value from `.env.example` through Vercel environment settings. Secrets must not use the `NEXT_PUBLIC_` prefix.
5. Set `NEXT_PUBLIC_SITE_URL` to the canonical verified HTTPS domain. Domain availability for `meetcollier.com` is not assumed.
6. Configure Cal.com webhook and redirect allowlists only after the preview hostname is stable.
7. Configure Supabase Auth redirect URLs, TOTP MFA, RLS migrations, point-in-time recovery or scheduled backups, and an initial least-privilege admin.
8. Run the full validation suite against a preview deployment before production promotion.
9. Do not enable live constituent intake until the legal, records, municipal-policy, privacy, accessibility, security, and incident-response reviews are signed off.

## Intake provider configuration

- Apply `supabase/migrations/202610120001_constituent_intake.sql` before adding the first administrator.
- Set `ADMIN_NOTIFICATION_EMAIL=garrettcollierbusiness@gmail.com`; set `EMAIL_FROM` to a verified transactional sender, not an arbitrary Gmail From address.
- Set both Turnstile keys and list only exact trusted hostnames in `TURNSTILE_ALLOWED_HOSTNAMES`.
- Generate `INTAKE_HASH_SECRET` independently from every other secret and rotate it only with a documented abuse-control migration plan.
- Keep `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and `INTAKE_HASH_SECRET` server-only.
- The intake endpoint remains unavailable if any required setting is missing.
- Create the first administrator in Supabase Auth, bootstrap the matching UUID as an `OWNER` in `public.admin_users`, enroll TOTP through `/admin/mfa`, and verify an AAL2 session can review a fictional case before activating intake.
