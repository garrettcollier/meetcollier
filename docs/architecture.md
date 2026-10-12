# Architecture

## Shape

Meet Collier is a modular monolith deployed as one Next.js application. Public rendering, server actions, route handlers, authorization, and integration adapters stay in one repository and one deployable unit. PostgreSQL remains the system of record. Third-party services handle capabilities that should not be rebuilt: Cal.com for scheduling, its configured calendar/video providers for conflict checking and private meeting links, Resend for email, and Sentry for monitoring.

## Boundaries

`src/app` is the delivery layer. Public routes contain no private case data. `src/modules` owns domain rules and will contain module-specific services and repositories for scheduling, intake, case management, events, publishing, commitments, civic resources, reporting, administration, audit, and settings. `src/lib` contains cross-cutting configuration and infrastructure clients.

Repositories are introduced only around database access or an external service boundary. Services own business rules such as case transitions and election-mode restrictions. React components do not receive database rows containing fields they do not render.

## Trust boundaries

- The browser is untrusted. Public Supabase keys may reach it; service-role keys never do.
- Proxy redirects are an optimistic UX check, not the authorization boundary.
- Protected layouts, server actions, route handlers, repositories, and PostgreSQL RLS re-check authorization.
- Admin access requires an authenticated JWT, AAL2, and an active admin record. Both the server layout and Stage C RLS policies enforce those checks.
- Public aggregates are generated server-side with minimum-cell suppression before Stage E launch.

## Operating mode

The default is `PRE_ELECTION`, which disables officeholder titles, official constituent intake, and Board-update authority. Mode is a content and capability guard, not a substitute for factual verification or legal review. Changing to `ELECTED_TRANSITION` or `IN_OFFICE` requires an owner-approved configuration change and launch review.

## Intake data flow

Intake: browser form → same-origin Route Handler → Zod validation → Turnstile verification → service → service-role repository → atomic database rate/duplicate controls and case creation → acknowledgment email containing only the reference and safe notices → admin notification without sensitive narrative. Raw IP addresses and user-agent strings are never stored; keyed hashes are used only for abuse controls.

Admin: verified Supabase session → MFA AAL2 → active role lookup → repository query constrained by RLS → audit event for sensitive reads. Case list/detail reading is implemented; mutation workflows remain pending.

The public navigation is intentionally centered on contact: Meet, Get Help, Events, and Resources. Publishing and commitment-register modules remain dormant, unlinked, and excluded from indexing until a clear public-service need exists.
