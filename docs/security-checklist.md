# Security checklist

## Implemented in Stage A

- [x] Strict TypeScript and server-first rendering
- [x] Admin routes fail closed without configuration or a verified session
- [x] AAL2 is required in both proxy and protected server layout
- [x] Secrets are separated from browser-exposed configuration
- [x] Admin indexing and caching are disabled
- [x] Baseline response security headers are configured
- [x] Operating mode defaults to restricted pre-election capabilities
- [x] No real constituent fixtures or mocked private records
- [x] Zod server validation and accessible client validation
- [x] Same-origin JSON endpoint with body-size restriction
- [x] Turnstile server verification with action and exact-hostname checks
- [x] Atomic database-backed rate limiting and duplicate suppression using keyed hashes
- [x] Sensitive narratives excluded from transactional email and application logs
- [x] RLS migration requires AAL2 plus an active administrator for private records
- [x] Service-role key is isolated to server-only code
- [x] Sensitive case reads create append-only audit events

## Required before live intake

- [ ] Apply the migration and independently verify RLS with anonymous, AAL1, AAL2 non-admin, inactive-admin, and active-admin sessions
- [ ] Complete interactive sign-in, TOTP enrollment/challenge, secure recovery, sign-out, and session-expiry handling
- [ ] Add role-specific authorization for every future mutation and export workflow
- [ ] Redact sensitive values from Sentry, Vercel, and application logs
- [ ] Add a nonce-based Content Security Policy compatible with Cal.com and monitoring
- [ ] Verify IDOR resistance using two users and anonymous requests
- [ ] Threat-model email, webhook replay, CSV formula injection, stored XSS, SSRF, and future uploads
- [ ] Configure key rotation, recovery, incident response, backups, and restore tests
- [ ] Complete dependency review and resolve or document all production audit findings
- [ ] Complete an independent penetration test before production constituent data
