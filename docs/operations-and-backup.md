# Operations and backup guide

## Daily operation

Review failed integrations, error alerts, overdue follow-ups, upcoming appointments, event changes, and audit anomalies. Do not place case narratives or resident identifiers in logs, tickets, screenshots, or chat systems.

## Database protection

Production requires automated Supabase backups appropriate to the selected plan, a documented recovery-point objective, a documented recovery-time objective, and quarterly restoration exercises into an isolated non-production environment. Export files are encrypted, access-controlled, time-limited, audited, and never stored in the repository.

Before any migration: review the SQL, take or confirm a current backup, run against a representative staging database, test rollback or forward repair, and verify RLS separately as anonymous and authenticated roles.

## Incident response

Contain access, preserve evidence, rotate affected credentials, review audit events, identify exposed records, consult legal counsel about notification duties, document the decision, and complete corrective actions. Do not delete potentially relevant records during an incident.
