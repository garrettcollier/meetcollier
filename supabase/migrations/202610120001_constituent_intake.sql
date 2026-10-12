-- Meet Collier: private constituent intake and case-management foundation.
-- All seed/test data must be fictional. Retention periods require legal approval.

create extension if not exists pgcrypto;

do $$ begin
  create type public.admin_role as enum ('OWNER', 'CASE_MANAGER', 'EDITOR', 'REPORT_VIEWER');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.contact_method as enum ('email', 'text', 'phone');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.case_category as enum (
    'roads_sidewalks', 'drainage_flooding', 'street_lighting', 'utilities',
    'animal_control', 'public_safety', 'housing_development', 'code_enforcement',
    'economic_development', 'general_question', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.case_status as enum (
    'NEW', 'ACKNOWLEDGED', 'UNDER_REVIEW', 'REFERRED_TO_APPROPRIATE_AGENCY',
    'AWAITING_RESPONSE', 'FOLLOW_UP_REQUIRED', 'RESOLVED', 'CLOSED_WITHOUT_RESOLUTION'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.case_priority as enum ('LOW', 'NORMAL', 'HIGH', 'URGENT');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.case_source_context as enum (
    'independent_community_platform', 'official_constituent_service'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role public.admin_role not null default 'CASE_MANAGER',
  display_name text not null check (char_length(display_name) between 2 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text check (email is null or char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 25),
  preferred_contact_method public.contact_method not null,
  general_location text check (general_location is null or char_length(general_location) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (email is not null or phone is not null),
  check (preferred_contact_method <> 'email' or email is not null),
  check (preferred_contact_method <> 'text' or phone is not null),
  check (preferred_contact_method <> 'phone' or phone is not null)
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  reference_id text not null unique check (reference_id ~ '^MC-[0-9]{4}-[A-F0-9]{10}$'),
  contact_id uuid not null references public.contacts(id) on delete restrict,
  category public.case_category not null,
  subject text not null check (char_length(subject) between 5 and 150),
  description text not null check (char_length(description) between 20 and 4000),
  status public.case_status not null default 'NEW',
  priority public.case_priority not null default 'NORMAL',
  source_context public.case_source_context not null,
  assigned_to uuid references public.admin_users(user_id) on delete set null,
  next_follow_up_at timestamptz,
  last_contact_at timestamptz,
  official_service_reference text check (
    official_service_reference is null or char_length(official_service_reference) <= 100
  ),
  resolution_description text check (
    resolution_description is null or char_length(resolution_description) <= 4000
  ),
  retention_status text not null default 'PENDING_LEGAL_REVIEW'
    check (retention_status in ('PENDING_LEGAL_REVIEW', 'HOLD', 'APPROVED_RETENTION_POLICY')),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  author_user_id uuid not null references public.admin_users(user_id) on delete restrict,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_events (
  id bigint generated always as identity primary key,
  case_id uuid not null references public.cases(id) on delete cascade,
  actor_user_id uuid references public.admin_users(user_id) on delete set null,
  event_type text not null check (char_length(event_type) between 2 and 80),
  previous_status public.case_status,
  new_status public.case_status,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(metadata) = 'object')
);

create table if not exists public.follow_up_tasks (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  assigned_to uuid references public.admin_users(user_id) on delete set null,
  due_at timestamptz not null,
  completed_at timestamptz,
  description text not null check (char_length(description) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (completed_at is null or completed_at >= created_at)
);

create table if not exists public.external_references (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  agency_name text not null check (char_length(agency_name) between 2 and 150),
  reference_number text not null check (char_length(reference_number) between 1 and 100),
  public_url text check (public_url is null or char_length(public_url) <= 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.admin_users(user_id) on delete set null,
  action text not null check (char_length(action) between 2 and 100),
  entity_type text not null check (char_length(entity_type) between 2 and 80),
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(metadata) = 'object')
);

-- These tables contain only keyed hashes, never a raw IP address or user-agent.
create table if not exists public.intake_rate_limits (
  rate_key text primary key check (char_length(rate_key) = 64),
  window_started_at timestamptz not null,
  submission_count integer not null default 1 check (submission_count > 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.intake_deduplication (
  submission_fingerprint text primary key check (char_length(submission_fingerprint) = 64),
  case_id uuid references public.cases(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists cases_created_at_idx on public.cases (created_at desc);
create index if not exists cases_status_created_at_idx on public.cases (status, created_at desc);
create index if not exists cases_category_created_at_idx on public.cases (category, created_at desc);
create index if not exists cases_assigned_follow_up_idx on public.cases (assigned_to, next_follow_up_at)
  where next_follow_up_at is not null;
create index if not exists case_events_case_created_idx on public.case_events (case_id, created_at desc);
create index if not exists case_notes_case_created_idx on public.case_notes (case_id, created_at desc);
create index if not exists follow_up_open_due_idx on public.follow_up_tasks (due_at)
  where completed_at is null;
create index if not exists external_references_case_idx on public.external_references (case_id);
create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create index if not exists intake_deduplication_expiry_idx on public.intake_deduplication (expires_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at before update on public.admin_users
for each row execute function public.set_updated_at();
drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at before update on public.contacts
for each row execute function public.set_updated_at();
drop trigger if exists cases_set_updated_at on public.cases;
create trigger cases_set_updated_at before update on public.cases
for each row execute function public.set_updated_at();
drop trigger if exists case_notes_set_updated_at on public.case_notes;
create trigger case_notes_set_updated_at before update on public.case_notes
for each row execute function public.set_updated_at();
drop trigger if exists follow_up_tasks_set_updated_at on public.follow_up_tasks;
create trigger follow_up_tasks_set_updated_at before update on public.follow_up_tasks
for each row execute function public.set_updated_at();

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
      and is_active = true
      and coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
  );
$$;

create or replace function public.is_owner_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
      and role = 'OWNER'
      and is_active = true
      and coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
  );
$$;

revoke all on function public.is_active_admin() from public;
grant execute on function public.is_active_admin() to authenticated;
revoke all on function public.is_owner_admin() from public;
grant execute on function public.is_owner_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.contacts enable row level security;
alter table public.cases enable row level security;
alter table public.case_notes enable row level security;
alter table public.case_events enable row level security;
alter table public.follow_up_tasks enable row level security;
alter table public.external_references enable row level security;
alter table public.audit_logs enable row level security;
alter table public.intake_rate_limits enable row level security;
alter table public.intake_deduplication enable row level security;

revoke all on public.admin_users, public.contacts, public.cases, public.case_notes,
  public.case_events, public.follow_up_tasks, public.external_references, public.audit_logs,
  public.intake_rate_limits, public.intake_deduplication from anon;
grant all on public.admin_users, public.contacts, public.cases, public.case_notes,
  public.case_events, public.follow_up_tasks, public.external_references, public.audit_logs,
  public.intake_rate_limits, public.intake_deduplication to service_role;
grant usage, select on all sequences in schema public to service_role;
grant select, insert, update, delete on public.admin_users, public.contacts, public.cases,
  public.case_notes, public.follow_up_tasks, public.external_references to authenticated;
grant select, insert on public.case_events, public.audit_logs to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create policy admin_users_admin_read on public.admin_users
  for select to authenticated using (public.is_active_admin());
create policy admin_users_owner_insert on public.admin_users
  for insert to authenticated with check (public.is_owner_admin());
create policy admin_users_owner_update on public.admin_users
  for update to authenticated using (public.is_owner_admin()) with check (public.is_owner_admin());
create policy admin_users_owner_delete on public.admin_users
  for delete to authenticated using (public.is_owner_admin());
create policy contacts_admin_access on public.contacts
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy cases_admin_access on public.cases
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy case_notes_admin_access on public.case_notes
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy case_events_admin_read on public.case_events
  for select to authenticated using (public.is_active_admin());
create policy case_events_admin_insert on public.case_events
  for insert to authenticated with check (public.is_active_admin());
create policy follow_up_tasks_admin_access on public.follow_up_tasks
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy external_references_admin_access on public.external_references
  for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy audit_logs_admin_read on public.audit_logs
  for select to authenticated using (public.is_active_admin());
create policy audit_logs_admin_insert on public.audit_logs
  for insert to authenticated with check (public.is_active_admin());

-- No authenticated or anonymous policies are defined for abuse-control tables.
-- Only the server-held service-role client can access them.

create or replace function public.create_public_assistance_case(
  p_category text,
  p_description text,
  p_email text,
  p_general_location text,
  p_name text,
  p_official_reference text,
  p_phone text,
  p_preferred_contact_method text,
  p_rate_key text,
  p_rate_limit integer,
  p_source_context text,
  p_subject text,
  p_submission_fingerprint text
)
returns table (case_id uuid, public_reference text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_case_id uuid := gen_random_uuid();
  v_contact_id uuid := gen_random_uuid();
  v_reference text;
  v_window timestamptz := date_trunc('hour', now());
  v_submission_count integer;
begin
  if p_rate_limit < 1 or p_rate_limit > 100 then
    raise exception using errcode = '22023', message = 'INVALID_RATE_LIMIT';
  end if;

  insert into public.intake_rate_limits (rate_key, window_started_at, submission_count)
  values (p_rate_key, v_window, 1)
  on conflict (rate_key) do update
  set submission_count = case
        when public.intake_rate_limits.window_started_at < v_window then 1
        else public.intake_rate_limits.submission_count + 1
      end,
      window_started_at = case
        when public.intake_rate_limits.window_started_at < v_window then v_window
        else public.intake_rate_limits.window_started_at
      end,
      updated_at = now()
  returning submission_count into v_submission_count;

  if v_submission_count > p_rate_limit then
    raise exception using errcode = 'P0001', message = 'INTAKE_RATE_LIMITED';
  end if;

  delete from public.intake_deduplication
  where submission_fingerprint = p_submission_fingerprint and expires_at <= now();

  begin
    insert into public.intake_deduplication (submission_fingerprint, expires_at)
    values (p_submission_fingerprint, now() + interval '24 hours');
  exception when unique_violation then
    raise exception using errcode = 'P0001', message = 'INTAKE_DUPLICATE';
  end;

  v_reference := 'MC-' || to_char(now() at time zone 'America/Chicago', 'YYYY') || '-' ||
    upper(substr(replace(v_case_id::text, '-', ''), 1, 10));

  insert into public.contacts (
    id, full_name, email, phone, preferred_contact_method, general_location
  ) values (
    v_contact_id, trim(p_name), nullif(trim(p_email), ''), nullif(trim(p_phone), ''),
    p_preferred_contact_method::public.contact_method, nullif(trim(p_general_location), '')
  );

  insert into public.cases (
    id, reference_id, contact_id, category, subject, description, source_context,
    official_service_reference
  ) values (
    v_case_id, v_reference, v_contact_id, p_category::public.case_category,
    trim(p_subject), trim(p_description), p_source_context::public.case_source_context,
    nullif(trim(p_official_reference), '')
  );

  update public.intake_deduplication
  set case_id = v_case_id
  where submission_fingerprint = p_submission_fingerprint;

  insert into public.case_events (case_id, event_type, metadata)
  values (v_case_id, 'CASE_CREATED', jsonb_build_object('source_context', p_source_context));

  return query select v_case_id, v_reference;
end;
$$;

revoke all on function public.create_public_assistance_case(
  text, text, text, text, text, text, text, text, text, integer, text, text, text
) from public, anon, authenticated;
grant execute on function public.create_public_assistance_case(
  text, text, text, text, text, text, text, text, text, integer, text, text, text
) to service_role;

comment on table public.cases is
  'Private assistance cases. No automatic deletion; retention requires approved legal policy.';
comment on table public.audit_logs is
  'Security-relevant administrative actions. Metadata must not include case descriptions or contact details.';
