# November 2026 launch checklist

## Before November 3, 2026

- [ ] Confirm election date, candidacy/public description, domain ownership, contact details, and all public copy.
- [ ] Keep `PRE_ELECTION`; verify no officeholder title, official constituent intake, or implied City authority appears.
- [ ] Complete Stages B–F in preview with fictional fixtures only.
- [ ] Finish legal, municipal-policy, privacy, records, accessibility, security, incident-response, and vendor review.
- [ ] Complete responsive browser, keyboard, screen-reader, zoom, reduced-motion, and WCAG 2.2 AA testing.
- [ ] Keep the Get Help form disabled until Supabase/RLS, admin MFA, Turnstile, Resend, backup restore, and notification-failure monitoring pass in preview.

## After a verified result

- [ ] Do not change mode from election-night projections or unofficial assumptions.
- [ ] If elected, use `ELECTED_TRANSITION` only after verification and approved incoming-title wording.
- [ ] Keep official constituent intake inactive until authority, policy, retention, and routing are confirmed.
- [ ] If not elected, move to `PRIVATE_CITIZEN` and verify that office-specific capabilities stay disabled.

## Before January 1, 2027

- [ ] Confirm the actual assumption-of-office date and title.
- [ ] Approve `IN_OFFICE` mode through a documented two-person review.
- [ ] Re-run auth, MFA, RLS, IDOR, backup restore, email, scheduling, reporting privacy, accessibility, and incident-response tests.
- [ ] Perform a limited monitored launch before broad promotion.
