# MEET COLLIER

An accessible, independent constituent-services and community-engagement platform for Garrett Collier, initially focused on Hot Springs, Arkansas, and City Director District 5.

The application is a Next.js modular monolith intended for Vercel with Supabase PostgreSQL and Auth. It must remain accurate before, during, and after public office. It is not the official City of Hot Springs website and does not contain campaign fundraising, voter targeting, or donor features.

## Current implementation

The current build provides the production-oriented public foundation plus the first Stage C intake slice:

- Next.js 16.4 App Router, React 19.3, strict TypeScript, Tailwind CSS 4, and shadcn/ui
- Responsive public site and every required public route
- Configurable five-state operating-mode model with safe `PRE_ELECTION` default
- Fail-closed `/admin` boundary using verified Supabase claims and mandatory AAL2 MFA
- Route-local server authorization check in addition to optimistic request proxying
- Metadata, generated social card, sitemap, robots rules, security headers, reduced motion, and accessible navigation
- Live inline Cal.com booking for Garrett's public 15-minute meeting, with an external fallback link and alternate text/email contact paths
- A secure Get Help form with Zod validation, honeypot and Turnstile checks, database-backed rate limiting and 24-hour duplicate protection
- Atomic private case creation, reference IDs, resident acknowledgment email, and an administrative email to `garrettcollierbusiness@gmail.com` that intentionally excludes private case details
- Explicit PostgreSQL migrations for private contacts, cases, events, notes, follow-ups, external references, audit records, abuse controls, constraints, indexes, and MFA-aware RLS
- Read-only protected case list/detail views with audit logging of sensitive case reads
- Vitest unit tests and Playwright accessibility/security smoke tests
- Simplified contact-hub navigation: Meet, Get Help, Events, and Resources. Publishing and priority routes are dormant and excluded from indexing.
- Explicit placeholders for unavailable credentials; intake fails closed and no integration claims success until the real providers are configured

Stage B public booking is connected, and the Stage C intake/data foundation plus interactive administrator sign-in and TOTP MFA enrollment/challenge flow are implemented but not enabled. Supabase, Turnstile, Resend, case mutations, and legal approval remain required before live collection. Appointment webhooks and Stages D–F remain incomplete. See [Architecture](docs/architecture.md) and [Launch checklist](docs/launch-checklist-november-2026.md).

## Local setup

Requirements: Node.js 22+, npm 10+, and no production constituent data.

```bash
cp .env.example .env.local
npm install
npm run dev
```

The public site works without external credentials. The Get Help form is visible but disabled, and `/admin` fails closed, until its providers are configured. Do not put secrets in source control or chat.

## Intake setup status

The application code is wired to send a reference-only notification to `ADMIN_NOTIFICATION_EMAIL` and an acknowledgment to a resident who supplies an email. To activate it safely:

1. Create isolated Supabase staging and production projects.
2. Apply `supabase/migrations/202610120001_constituent_intake.sql` and verify every RLS policy with anonymous, AAL1, AAL2 non-admin, and AAL2 active-admin sessions.
3. Create the first Supabase Auth owner, require TOTP MFA, and add that Auth UUID to `public.admin_users` as `OWNER` through an audited service-role/bootstrap procedure.
4. Configure a verified Resend sender and Cloudflare Turnstile widget for the exact staging or production hostname.
5. Generate a strong independent `INTAKE_HASH_SECRET` and add all `.env.example` values in Vercel.
6. Complete legal, municipal-policy, records, privacy, security, backup/restore, accessibility, and incident-response review before enabling collection.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Do not add real constituent information to fixtures, logs, screenshots, or development databases.

## Documentation

- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
- [Operations and backup](docs/operations-and-backup.md)
- [Security checklist](docs/security-checklist.md)
- [Records and FOIA review](docs/records-and-foia-review.md)
- [November 2026 launch checklist](docs/launch-checklist-november-2026.md)
