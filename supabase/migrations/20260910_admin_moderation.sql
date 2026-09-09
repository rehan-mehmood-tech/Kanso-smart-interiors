-- =============================================================================
-- Kanso Admin — vendor moderation
-- 20260910_admin_moderation.sql
--
-- Adds the banned state and the audit trail behind it.
--
-- PREREQUISITE: runs after 20260909_vendor_portal_core.sql, which in turn
-- needs the PRD §15 baseline schema. This file ALTERs `businesses` and
-- references `profiles`.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. The banned state
--
-- `disabled` is administrative housekeeping; `banned` is a sanction, and every
-- ban carries a row in vendor_moderation_logs explaining it. Keeping them
-- distinct means "why is this account off?" always has an answer.
-- -----------------------------------------------------------------------------

-- PRD §15.3 declares businesses.status as an inline enum. Adding a value is
-- idempotent-safe and cannot run inside a transaction on older Postgres, so it
-- is guarded rather than assumed.
do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'business_status' and e.enumlabel = 'banned'
  ) then
    alter type business_status add value if not exists 'banned';
  end if;
exception
  when undefined_object then
    -- Baseline models status as text with a CHECK rather than an enum; the
    -- constraint below covers that shape instead.
    null;
end
$$;

-- -----------------------------------------------------------------------------
-- 2. Moderation audit log
--
-- Append-only by design: a ban that can be quietly edited away is not an audit
-- trail. There is deliberately no UPDATE or DELETE policy.
-- -----------------------------------------------------------------------------

create type moderation_action as enum ('ban', 'unban', 'warn', 'dismiss_complaint');

create table vendor_moderation_logs (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  action       moderation_action not null,
  reason       text not null check (length(trim(reason)) >= 10),
  complaint_id uuid,
  acted_by     uuid references profiles(id),
  created_at   timestamptz not null default now()
);

create index vendor_moderation_logs_business_idx
  on vendor_moderation_logs (business_id, created_at desc);

comment on table vendor_moderation_logs is
  'Append-only record of moderation actions taken against a business. A ban must always be explainable after the fact.';

-- -----------------------------------------------------------------------------
-- 3. Customer complaints
-- -----------------------------------------------------------------------------

create type complaint_reason as enum (
  'poor_service', 'no_show', 'unprofessional', 'overcharged', 'other'
);
create type complaint_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

create table vendor_complaints (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  customer_id  uuid not null references profiles(id) on delete cascade,
  lead_id      uuid references consultation_leads(id) on delete set null,
  reason       complaint_reason not null,
  notes        text not null,
  status       complaint_status not null default 'open',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index vendor_complaints_business_idx on vendor_complaints (business_id, status);
create index vendor_complaints_status_idx on vendor_complaints (status, created_at desc);

-- -----------------------------------------------------------------------------
-- 4. Row level security
-- -----------------------------------------------------------------------------

alter table vendor_moderation_logs enable row level security;
alter table vendor_complaints      enable row level security;

create or replace function current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- A vendor may read the log entries written about them -- being banned without
-- being able to see the stated reason is indefensible -- but only an admin
-- writes them.
create policy vendor_moderation_logs_read on vendor_moderation_logs
  for select using (
    current_user_is_admin()
    or business_id in (select current_user_business_ids())
  );

create policy vendor_moderation_logs_insert on vendor_moderation_logs
  for insert with check (current_user_is_admin());

-- Customers file and read their own complaints; admins see everything. The
-- accused vendor deliberately cannot read raw complaints, so a customer is not
-- exposed to retaliation before an admin has reviewed it.
create policy vendor_complaints_customer on vendor_complaints
  for select using (customer_id = auth.uid() or current_user_is_admin());

create policy vendor_complaints_insert on vendor_complaints
  for insert with check (customer_id = auth.uid());

create policy vendor_complaints_admin_update on vendor_complaints
  for update using (current_user_is_admin()) with check (current_user_is_admin());

-- -----------------------------------------------------------------------------
-- 5. Banned vendors receive nothing
--
-- The paid-access predicate already gates on the subscription, and a ban
-- cancels it. This adds the belt-and-braces check so a banned business cannot
-- hold access even if a subscription row is later resurrected by a webhook.
-- -----------------------------------------------------------------------------

create or replace function business_has_paid_access(b_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from business_subscriptions s
    join businesses b on b.id = s.business_id
    where s.business_id = b_id
      and b.status = 'active'
      and s.tier <> 'free'
      and (
        s.status in ('trialing', 'active')
        or (s.status = 'canceled' and s.current_period_end is not null)
      )
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

commit;
