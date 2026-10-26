-- Durable generation queue, consultation idempotency, and atomic interactions.

alter table design_generations
  add column if not exists requested_count integer not null default 5
    check (requested_count between 4 and 6),
  add column if not exists gating_report jsonb not null default '{}'::jsonb,
  add column if not exists claimed_at timestamptz,
  add column if not exists attempts integer not null default 0;

-- Preserve the earliest submission if historical concurrent requests created
-- duplicates, then make project-level consultation submission truly atomic.
delete from consultation_leads newer
using consultation_leads older
where newer.project_id = older.project_id
  and newer.project_id is not null
  and (newer.created_at, newer.id) > (older.created_at, older.id);

create unique index if not exists consultation_leads_one_per_project_idx
  on consultation_leads (project_id)
  where project_id is not null;

create or replace function claim_generation_job(p_stale_after_seconds integer default 300)
returns setof design_generations
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed design_generations;
begin
  update design_generations
  set status = 'pending', claimed_at = null
  where status = 'processing'
    and claimed_at < now() - make_interval(secs => p_stale_after_seconds);

  select * into claimed
  from design_generations
  where status = 'pending'
  order by created_at
  for update skip locked
  limit 1;

  if claimed.id is null then return; end if;

  update design_generations
  set status = 'processing', claimed_at = now(), attempts = attempts + 1
  where id = claimed.id
  returning * into claimed;
  return next claimed;
end;
$$;

revoke all on function claim_generation_job(integer) from public, anon, authenticated;
grant execute on function claim_generation_job(integer) to service_role;

create or replace function toggle_design_interaction(
  p_user_id uuid,
  p_design_id uuid,
  p_project_id uuid,
  p_interaction_type text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  if p_interaction_type not in ('like', 'save') then
    raise exception 'Unsupported interaction type';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    p_user_id::text || ':' || p_design_id::text || ':' || p_interaction_type, 0
  ));

  delete from design_interactions
  where user_id = p_user_id
    and design_id = p_design_id
    and interaction_type = p_interaction_type;
  get diagnostics deleted_count = row_count;
  if deleted_count > 0 then return false; end if;

  insert into design_interactions(user_id, design_id, project_id, interaction_type)
  values (p_user_id, p_design_id, p_project_id, p_interaction_type);
  return true;
end;
$$;

revoke all on function toggle_design_interaction(uuid, uuid, uuid, text)
  from public, anon, authenticated;
grant execute on function toggle_design_interaction(uuid, uuid, uuid, text)
  to service_role;

alter table profiles add column if not exists status text not null default 'active'
  check (status in ('active', 'suspended'));

create table if not exists vendor_moderation_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  action text not null check (action in ('ban', 'unban', 'warn', 'dismiss_complaint')),
  reason text not null,
  complaint_id uuid references customer_disputes(id) on delete set null,
  acted_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table vendor_moderation_logs enable row level security;
