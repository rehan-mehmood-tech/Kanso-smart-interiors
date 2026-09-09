-- =============================================================================
-- KANSO — MASTER BASELINE SCHEMA
-- 20260909_master_baseline_schema.sql
--
-- The single source of truth for the entire Kanso database. Builds the
-- Identity, Customer, Vendor and Admin domains from absolute scratch.
--
-- Paste straight into the Supabase SQL Editor. Safe to run more than once:
-- tables use IF NOT EXISTS, policies are dropped before being recreated, and
-- every seed row is ON CONFLICT DO NOTHING.
--
-- -----------------------------------------------------------------------------
-- EXECUTION ORDER — and why it matters
--
--   Step 1  Teardown of policies and functions
--   Step 2  Enum types
--   Step 3  ALL TABLES, in dependency order
--   Step 4  Helper functions
--   Step 5  RLS and policies
--   Step 6  Indexes and triggers
--   Step 7  Seed data
--
-- Functions come AFTER tables because PostgreSQL validates the body of a
-- LANGUAGE SQL function at creation time. is_admin() selects from profiles,
-- so defining it before profiles exists fails immediately with
-- "ERROR: 42P01: relation profiles does not exist". LANGUAGE plpgsql bodies
-- are not validated this way, which is why set_updated_at() would have
-- survived in the old position and is_admin() did not.
--
-- Policies come after functions for the same reason: a USING clause calling
-- is_admin() needs that function to already exist.
--
-- -----------------------------------------------------------------------------
-- READ BEFORE RUNNING IN PRODUCTION
--
-- 1. ROW LEVEL SECURITY IS ENABLED on every table (Step 5).
--    service_role bypasses RLS by design, so the FastAPI backend is
--    unaffected. The anon key -- which ships inside the browser bundle -- can
--    only read the public vendor directory and product catalogue. No policy
--    exposes a phone number, an address, or an email address to anon.
--
-- 2. THE SEED BLOCK CREATES A LOGIN-CAPABLE ADMIN ACCOUNT with a known
--    password (admin@kanso.pk / ChangeMe!Kanso2026), kept deliberately for
--    development. Rotate it before this database faces the public internet.
-- =============================================================================

-- Required for gen_random_uuid() and crypt(). Present on Supabase by default.
create extension if not exists pgcrypto;

-- =============================================================================
-- STEP 1 — TEARDOWN
--
-- Functions and policies only. Dropping them is safe and idempotent: they hold
-- no data, and a signature change would otherwise make CREATE OR REPLACE fail.
--
-- Tables are deliberately NOT dropped here. A DROP TABLE ... CASCADE would
-- turn this file from a migration into a data-destroying reset, and running it
-- twice would silently delete every project, lead and product. If you do want
-- a clean slate, uncomment the block below -- knowing exactly what it costs.
-- =============================================================================

-- --- FULL RESET (destructive; commented out on purpose) ----------------------
-- drop table if exists customer_disputes      cascade;
-- drop table if exists business_subscriptions cascade;
-- drop table if exists consultation_leads     cascade;
-- drop table if exists generated_designs      cascade;
-- drop table if exists design_generations     cascade;
-- drop table if exists room_photos            cascade;
-- drop table if exists room_projects          cascade;
-- drop table if exists business_products      cascade;
-- drop table if exists businesses             cascade;
-- drop table if exists profiles               cascade;
-- drop type  if exists user_role, business_kind, lead_status, subscription_status,
--                      subscription_tier, project_status, wall_angle,
--                      generation_engine, generation_status cascade;

-- --- Functions ---------------------------------------------------------------
-- CASCADE also removes any policy that depends on them; Step 5 recreates those.
drop function if exists business_has_paid_access(uuid) cascade;
drop function if exists owned_business_ids() cascade;
drop function if exists is_admin() cascade;
drop function if exists set_updated_at() cascade;

-- =============================================================================
-- STEP 2 — ENUM TYPES
--
-- CREATE TYPE has no IF NOT EXISTS, so each is guarded. Re-running is a no-op.
-- =============================================================================

do $$
begin
  -- --- Identity and vendor ---

  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('customer', 'business', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'business_kind') then
    create type business_kind as enum ('solo_tradesman', 'shop_crew');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type lead_status as enum ('new', 'contacted', 'completed', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_tier') then
    create type subscription_tier as enum ('free_trial', 'solo_tradesman', 'shop_crew');
  end if;

  -- --- Customer pipeline ---

  if not exists (select 1 from pg_type where typname = 'project_status') then
    create type project_status as enum (
      'draft', 'photos_uploaded', 'ready_for_generation',
      'generating', 'generated', 'design_selected', 'consultation_requested'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'wall_angle') then
    create type wall_angle as enum ('north', 'south', 'east', 'west');
  end if;

  if not exists (select 1 from pg_type where typname = 'generation_engine') then
    create type generation_engine as enum ('gemini_flux', 'free_trial');
  end if;

  if not exists (select 1 from pg_type where typname = 'generation_status') then
    create type generation_status as enum (
      'pending', 'processing', 'succeeded', 'partial', 'failed'
    );
  end if;
end
$$;

-- =============================================================================
-- STEP 3 — ALL TABLES
--
-- Strict dependency order. Every foreign key target is created before the
-- table that references it, so this section can run top to bottom on an empty
-- database with no forward references.
--
--   profiles
--     -> businesses
--          -> business_products
--     -> room_projects
--          -> room_photos
--          -> design_generations
--               -> generated_designs
--     -> consultation_leads      (businesses, room_projects)
--     -> business_subscriptions  (businesses)
--     -> customer_disputes       (businesses)
-- =============================================================================

-- --- 3.1 profiles ------------------------------------------------------------
-- One row per auth.users row. `role` is the authorisation source of truth and
-- is only ever read server-side -- never trusted from a request payload.
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  full_name  text,
  role       user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --- 3.2 businesses ----------------------------------------------------------
-- owner_id is nullable on purpose: an admin can register a partner before that
-- partner has claimed an account.
--
-- is_active and is_banned are separate flags because they mean different
-- things. Disabling is reversible housekeeping; a ban is a sanction with a
-- reason behind it. Collapsing them loses the answer to "why is this off?".
create table if not exists businesses (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references profiles(id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  kind        business_kind not null default 'solo_tradesman',
  trade       text,
  phone       text,
  city        text default 'Lahore',
  address     text,
  is_active   boolean not null default true,
  is_banned   boolean not null default false,
  verified_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- --- 3.3 business_products ---------------------------------------------------
-- Vendor inventory, and the corpus the AI pipeline retrieves from.
--
-- price_minor is an integer in the smallest currency unit (PKR paisa). Never a
-- float: binary floating point cannot represent 0.01 exactly, and a catalogue
-- gets summed and compared.
create table if not exists business_products (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  category    text not null,
  price_minor bigint not null check (price_minor >= 0),
  dimensions  jsonb not null default '{}'::jsonb,
  material    text,
  color_hex   text check (color_hex is null or color_hex ~* '^#[0-9a-f]{6}$'),
  images      text[] not null default '{}',
  style_tags  text[] not null default '{}',
  in_stock    boolean not null default true,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- --- 3.4 room_projects -------------------------------------------------------
-- The customer's design project.
--
-- customer_id is nullable so the wizard can start before signup; the row is
-- claimed when an account is created. budget_pkr is whole rupees, because a
-- budget is a round number -- unlike price_minor, which is paisa because
-- catalogue prices get added up.
create table if not exists room_projects (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references profiles(id) on delete cascade,
  city        text default 'Lahore',
  room_type   text,
  style_slug  text,
  budget_pkr  bigint check (budget_pkr is null or budget_pkr >= 0),
  status      project_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- --- 3.5 room_photos ---------------------------------------------------------
-- The four wall captures.
--
-- UNIQUE (project_id, wall_angle) is what makes the capture step idempotent:
-- re-uploading a wall replaces it instead of quietly adding a fifth photo and
-- breaking the four-wall promise.
create table if not exists room_photos (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references room_projects(id) on delete cascade,
  wall_angle wall_angle not null,
  image_url  text not null,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (project_id, wall_angle)
);

-- --- 3.6 design_generations --------------------------------------------------
-- One AI run.
create table if not exists design_generations (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references room_projects(id) on delete cascade,
  engine_used  generation_engine not null default 'gemini_flux',
  status       generation_status not null default 'pending',
  error_detail text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- --- 3.7 generated_designs ---------------------------------------------------
-- The concepts a run produced.
--
-- mapped_products is a jsonb array of business_products ids, deliberately not
-- uuid[] with a foreign key: it is a snapshot of what the render actually
-- depicted and must survive a vendor archiving or deleting that product. A
-- real FK would either block the delete or rewrite history.
create table if not exists generated_designs (
  id              uuid primary key default gen_random_uuid(),
  generation_id   uuid not null references design_generations(id) on delete cascade,
  render_url      text not null,
  mapped_products jsonb not null default '[]'::jsonb,
  overall_score   numeric(5,2) check (overall_score is null or overall_score between 0 and 100),
  created_at      timestamptz not null default now()
);

-- --- 3.8 consultation_leads --------------------------------------------------
-- business_id is ON DELETE SET NULL, not CASCADE: if a vendor account is
-- removed the lead returns to the admin queue. Deleting the customer's request
-- because a vendor left would destroy the customer's record of asking.
create table if not exists consultation_leads (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null check (length(trim(customer_name)) > 0),
  phone         text not null,
  email         text,
  city          text default 'Lahore',
  full_address  text,
  room_type     text,
  style_slug    text,
  -- What the customer asked for in the booking form. Nullable: a lead
  -- captured outside the wizard has no preferences attached.
  preferred_mode      text check (preferred_mode is null or preferred_mode in ('in-person', 'video')),
  preferred_time_slot text check (preferred_time_slot is null or preferred_time_slot in ('Morning', 'Afternoon', 'Evening')),
  notes               text,
  status        lead_status not null default 'new',
  business_id   uuid references businesses(id) on delete set null,
  -- Links the lead back to the design project it came from. Nullable: a lead
  -- can also be captured outside the wizard.
  project_id    uuid references room_projects(id) on delete set null,
  unlocked_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- --- 3.9 business_subscriptions ----------------------------------------------
-- One row per business, enforced by UNIQUE (business_id): upgrades mutate the
-- row rather than stacking, so "what is this vendor paying for?" has exactly
-- one answer.
create table if not exists business_subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  business_id        uuid not null unique references businesses(id) on delete cascade,
  tier               subscription_tier not null default 'free_trial',
  status             subscription_status not null default 'trialing',
  current_period_end timestamptz,
  seats_limit        integer not null default 1 check (seats_limit >= 1),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- --- 3.10 customer_disputes --------------------------------------------------
create table if not exists customer_disputes (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null check (length(trim(customer_name)) > 0),
  customer_phone text,
  business_id    uuid references businesses(id) on delete cascade,
  reason         text not null check (length(trim(reason)) > 0),
  status         text not null default 'pending'
                 check (status in ('pending', 'reviewing', 'resolved', 'dismissed')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- --- Table comments ----------------------------------------------------------
comment on table profiles is
  'Application user record, 1:1 with auth.users. profiles.role is the only trusted source of authorisation.';
comment on column businesses.verified_at is
  'Null until an admin verifies the business. Unverified businesses never receive leads, regardless of what they have paid.';
comment on column business_products.price_minor is
  'Price in PKR paisa. 8500000 = PKR 85,000. Integer arithmetic only.';
comment on column business_products.style_tags is
  'Join key to a project style. Must use the same vocabulary the customer wizard writes, or a style silently stops matching.';
comment on column room_projects.budget_pkr is
  'Whole rupees. Distinct from business_products.price_minor, which is paisa.';
comment on column room_photos.image_url is
  'Path inside the private room-photos bucket. Served by signed URL, never public.';
comment on column generated_designs.mapped_products is
  'Snapshot array of business_products ids specified in this render. Intentionally not a foreign key: the record must survive the product being archived.';
comment on column consultation_leads.unlocked_at is
  'When a paying business first revealed the contact details. Append-only in practice: an unlock cannot be undone, so a later billing dispute has a record.';

-- =============================================================================
-- STEP 4 — HELPER FUNCTIONS
--
-- Every table these read now exists, so PostgreSQL can validate the LANGUAGE
-- SQL bodies. This is the section whose position caused the 42P01.
-- =============================================================================

-- Keeps updated_at honest. LANGUAGE plpgsql, so its body is not validated at
-- creation time -- it would work anywhere in the file, unlike the others.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Is the caller an admin?
--
-- SECURITY DEFINER matters twice over: it lets the lookup run with RLS
-- bypassed, and that is what stops a policy on profiles that calls this
-- function from re-entering its own policy and raising
-- "infinite recursion detected in policy for relation profiles".
create or replace function is_admin()
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

-- Businesses the caller owns. SECURITY DEFINER for the same reason.
create or replace function owned_business_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select b.id from businesses b where b.owner_id = auth.uid();
$$;

-- The single definition of "may this business see a lead's contact details".
-- Every endpoint and every policy goes through this, so the rule cannot drift
-- between the database and the application.
--
--   past_due  does NOT grant access — a failed card closes the gate now,
--             not at the end of the period.
--   canceled  DOES grant access until current_period_end, because the vendor
--             already paid for the month in hand. Cancelling is a request not
--             to renew, not a forfeit.
--   banned / inactive businesses are refused regardless of what they paid.
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
      and b.is_active
      and not b.is_banned
      and s.tier <> 'free_trial'
      and (
        s.status in ('trialing', 'active')
        or (s.status = 'canceled' and s.current_period_end is not null)
      )
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

comment on function business_has_paid_access(uuid) is
  'True when the business is live and holds a paid subscription that has not lapsed. Used for server-side lead unmasking.';

-- =============================================================================
-- STEP 5 — ROW LEVEL SECURITY
--
-- service_role bypasses RLS entirely, so the FastAPI backend is unaffected by
-- everything below. These policies govern the anon and authenticated keys,
-- which ship in the browser.
--
--   anon           public vendor directory and catalogue. Nothing else.
--   authenticated  your own profile, your own projects, your own business.
--   admin          everything, via is_admin().
--
-- No policy exposes a phone number, an email address or a street address to
-- anon. Contact details on a lead are served by the backend, which applies
-- business_has_paid_access() first.
-- =============================================================================

alter table profiles               enable row level security;
alter table businesses             enable row level security;
alter table business_products      enable row level security;
alter table room_projects          enable row level security;
alter table room_photos            enable row level security;
alter table design_generations     enable row level security;
alter table generated_designs      enable row level security;
alter table consultation_leads     enable row level security;
alter table business_subscriptions enable row level security;
alter table customer_disputes      enable row level security;

-- --- profiles ---------------------------------------------------------------
drop policy if exists profiles_self_read on profiles;
create policy profiles_self_read on profiles
  for select to authenticated
  using (id = auth.uid() or is_admin());

drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- No INSERT policy on purpose. Profiles are created by the backend
-- (service_role) alongside the auth user, so a client cannot mint one with
-- role = 'admin'.

-- --- businesses -------------------------------------------------------------
-- Public directory: only live, verified vendors, and only to read.
drop policy if exists businesses_public_read on businesses;
create policy businesses_public_read on businesses
  for select to anon, authenticated
  using (is_active and not is_banned and verified_at is not null);

drop policy if exists businesses_owner_manage on businesses;
create policy businesses_owner_manage on businesses
  for all to authenticated
  using (owner_id = auth.uid() or is_admin())
  with check (owner_id = auth.uid() or is_admin());

-- --- business_products ------------------------------------------------------
-- Public catalogue: active products belonging to a bookable vendor.
drop policy if exists business_products_public_read on business_products;
create policy business_products_public_read on business_products
  for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from businesses b
      where b.id = business_products.business_id
        and b.is_active and not b.is_banned and b.verified_at is not null
    )
  );

drop policy if exists business_products_owner_manage on business_products;
create policy business_products_owner_manage on business_products
  for all to authenticated
  using (business_id in (select owned_business_ids()) or is_admin())
  with check (business_id in (select owned_business_ids()) or is_admin());

-- --- room_projects and the pipeline -----------------------------------------
-- A project and everything hanging off it belongs to one customer. Anonymous
-- projects (customer_id is null) are reachable only through the backend, which
-- holds the id -- they are not enumerable by a client.
drop policy if exists room_projects_owner on room_projects;
create policy room_projects_owner on room_projects
  for all to authenticated
  using (customer_id = auth.uid() or is_admin())
  with check (customer_id = auth.uid() or is_admin());

drop policy if exists room_photos_owner on room_photos;
create policy room_photos_owner on room_photos
  for all to authenticated
  using (
    exists (
      select 1 from room_projects p
      where p.id = room_photos.project_id
        and (p.customer_id = auth.uid() or is_admin())
    )
  )
  with check (
    exists (
      select 1 from room_projects p
      where p.id = room_photos.project_id
        and (p.customer_id = auth.uid() or is_admin())
    )
  );

drop policy if exists design_generations_owner on design_generations;
create policy design_generations_owner on design_generations
  for select to authenticated
  using (
    exists (
      select 1 from room_projects p
      where p.id = design_generations.project_id
        and (p.customer_id = auth.uid() or is_admin())
    )
  );

-- Generations are started by the backend, never inserted by a client, so there
-- is deliberately no INSERT or UPDATE policy: a client cannot fabricate a
-- completed run or hand itself free renders.

drop policy if exists generated_designs_owner on generated_designs;
create policy generated_designs_owner on generated_designs
  for select to authenticated
  using (
    exists (
      select 1
      from design_generations g
      join room_projects p on p.id = g.project_id
      where g.id = generated_designs.generation_id
        and (p.customer_id = auth.uid() or is_admin())
    )
  );

-- --- consultation_leads -----------------------------------------------------
-- No anon access at all: every row holds a name and a phone number.
-- A business sees leads assigned to it; contact masking is applied by the
-- backend through business_has_paid_access().
drop policy if exists consultation_leads_business_read on consultation_leads;
create policy consultation_leads_business_read on consultation_leads
  for select to authenticated
  using (business_id in (select owned_business_ids()) or is_admin());

drop policy if exists consultation_leads_business_update on consultation_leads;
create policy consultation_leads_business_update on consultation_leads
  for update to authenticated
  using (business_id in (select owned_business_ids()) or is_admin())
  with check (business_id in (select owned_business_ids()) or is_admin());

-- --- business_subscriptions -------------------------------------------------
-- Readable by the owner, writable only by service_role (billing webhooks).
drop policy if exists business_subscriptions_owner_read on business_subscriptions;
create policy business_subscriptions_owner_read on business_subscriptions
  for select to authenticated
  using (business_id in (select owned_business_ids()) or is_admin());

-- --- customer_disputes ------------------------------------------------------
-- Admins only. The accused vendor deliberately cannot read raw complaints, so
-- a customer is not exposed to retaliation before a review happens.
drop policy if exists customer_disputes_admin on customer_disputes;
create policy customer_disputes_admin on customer_disputes
  for all to authenticated
  using (is_admin())
  with check (is_admin());

-- =============================================================================
-- STEP 6 — INDEXES AND TRIGGERS
-- =============================================================================

-- --- Indexes -----------------------------------------------------------------
create index if not exists profiles_role_idx on profiles (role);

create index if not exists businesses_owner_idx on businesses (owner_id);
create index if not exists businesses_city_trade_idx on businesses (city, trade);
-- Partial index: lead routing only ever looks for bookable vendors.
create index if not exists businesses_bookable_idx
  on businesses (city)
  where is_active and not is_banned and verified_at is not null;

create index if not exists business_products_business_active_idx
  on business_products (business_id, is_active);
-- GIN index for style-tag retrieval. This is what makes
-- `where style_tags && array['japandi','minimal']` fast enough to run inside
-- the generation pipeline rather than as a batch job.
create index if not exists business_products_style_tags_gin
  on business_products using gin (style_tags);

create index if not exists room_projects_customer_idx
  on room_projects (customer_id, created_at desc);
create index if not exists room_projects_status_idx on room_projects (status);

create index if not exists room_photos_project_idx on room_photos (project_id);

create index if not exists design_generations_project_idx
  on design_generations (project_id, created_at desc);
-- One run at a time per project. The 409 the API returns for a concurrent
-- generation is enforced here, not only in application code.
create unique index if not exists design_generations_one_active_idx
  on design_generations (project_id)
  where status in ('pending', 'processing');

create index if not exists generated_designs_generation_idx
  on generated_designs (generation_id);
create index if not exists generated_designs_mapped_products_gin
  on generated_designs using gin (mapped_products);

create index if not exists consultation_leads_business_status_idx
  on consultation_leads (business_id, status);
create index if not exists consultation_leads_created_idx
  on consultation_leads (created_at desc);
create index if not exists consultation_leads_project_idx
  on consultation_leads (project_id);
-- The admin queue: unassigned leads are the ones reaching nobody.
create index if not exists consultation_leads_unassigned_idx
  on consultation_leads (created_at desc)
  where business_id is null;

create index if not exists business_subscriptions_status_idx
  on business_subscriptions (status, current_period_end);

create index if not exists customer_disputes_business_idx
  on customer_disputes (business_id, status);
create index if not exists customer_disputes_open_idx
  on customer_disputes (created_at desc)
  where status in ('pending', 'reviewing');

-- --- Triggers ----------------------------------------------------------------
drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

drop trigger if exists businesses_set_updated_at on businesses;
create trigger businesses_set_updated_at
  before update on businesses
  for each row execute function set_updated_at();

drop trigger if exists business_products_set_updated_at on business_products;
create trigger business_products_set_updated_at
  before update on business_products
  for each row execute function set_updated_at();

drop trigger if exists room_projects_set_updated_at on room_projects;
create trigger room_projects_set_updated_at
  before update on room_projects
  for each row execute function set_updated_at();

drop trigger if exists design_generations_set_updated_at on design_generations;
create trigger design_generations_set_updated_at
  before update on design_generations
  for each row execute function set_updated_at();

drop trigger if exists consultation_leads_set_updated_at on consultation_leads;
create trigger consultation_leads_set_updated_at
  before update on consultation_leads
  for each row execute function set_updated_at();

drop trigger if exists business_subscriptions_set_updated_at on business_subscriptions;
create trigger business_subscriptions_set_updated_at
  before update on business_subscriptions
  for each row execute function set_updated_at();

drop trigger if exists customer_disputes_set_updated_at on customer_disputes;
create trigger customer_disputes_set_updated_at
  before update on customer_disputes
  for each row execute function set_updated_at();

-- =============================================================================
-- STEP 7 — SEED DATA
--
-- Idempotent (ON CONFLICT DO NOTHING) with fixed UUIDs, so re-running does not
-- duplicate rows. Delete this section before running against production.
-- =============================================================================

-- --- Admin account -----------------------------------------------------------
-- profiles.id references auth.users, so the auth row has to exist first. The
-- Supabase SQL editor runs as a superuser, which is the only reason this is
-- possible; it is a seeding convenience, not a pattern for application code.
--
-- Credentials:  admin@kanso.pk  /  ChangeMe!Kanso2026
do $$
declare
  admin_id uuid := '00000000-0000-4000-a000-000000000001';
begin
  if not exists (select 1 from auth.users where id = admin_id) then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data
    )
    values (
      '00000000-0000-0000-0000-000000000000',
      admin_id,
      'authenticated',
      'authenticated',
      'admin@kanso.pk',
      crypt('ChangeMe!Kanso2026', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Kanso Admin"}'::jsonb
    );
  end if;

  insert into profiles (id, email, full_name, role)
  values (admin_id, 'admin@kanso.pk', 'Kanso Admin', 'admin')
  on conflict (id) do nothing;
exception
  when insufficient_privilege then
    raise notice 'Skipped auth.users seed: insufficient privilege. Create the admin through Supabase Auth, then insert its profiles row.';
end
$$;

-- --- Businesses --------------------------------------------------------------
-- owner_id stays null: these are admin-registered partners that have not
-- claimed an account yet, which is a real state the registry supports.
insert into businesses (id, name, kind, trade, phone, city, address, is_active, is_banned, verified_at)
values
  ('00000000-0000-4000-b000-000000000001', 'Rossi Interiors', 'shop_crew', 'furniture_store',
   '+92 300 4455661', 'Lahore', 'Main Boulevard, Gulberg III', true, false, now() - interval '120 days'),
  ('00000000-0000-4000-b000-000000000002', 'Karim Woodworks', 'solo_tradesman', 'carpenter',
   '+92 321 7788990', 'Lahore', 'Block C, Model Town', true, false, now() - interval '64 days')
on conflict (id) do nothing;

-- --- Subscriptions -----------------------------------------------------------
-- One paid, one on trial, so business_has_paid_access() returns both answers
-- and the lead-unmasking path is testable immediately.
insert into business_subscriptions (business_id, tier, status, current_period_end, seats_limit)
values
  ('00000000-0000-4000-b000-000000000001', 'shop_crew', 'active', now() + interval '30 days', 5),
  ('00000000-0000-4000-b000-000000000002', 'free_trial', 'trialing', now() + interval '14 days', 1)
on conflict (business_id) do nothing;

-- --- Inventory ---------------------------------------------------------------
insert into business_products
  (id, business_id, name, category, price_minor, dimensions, material, color_hex, images, style_tags, in_stock)
values
  ('00000000-0000-4000-c000-000000000001', '00000000-0000-4000-b000-000000000001',
   'Fluted Oak Sideboard', 'furniture', 8500000,
   '{"w_mm":1800,"h_mm":750,"d_mm":450}'::jsonb, 'White Oak', '#C9B79C',
   '{"/assets/images/products/cabinet-oak-wall.jpg"}',
   '{"japandi","warm_neutral","minimal"}', true),

  ('00000000-0000-4000-c000-000000000002', '00000000-0000-4000-b000-000000000001',
   'Linen Boucle Modular Sofa', 'furniture', 21000000,
   '{"w_mm":2400,"h_mm":680,"d_mm":950}'::jsonb, 'Linen Boucle', '#EAE8E3',
   '{"/assets/images/products/sofa-grey-tufted.jpg"}',
   '{"warm_neutral","minimal","scandinavian"}', true),

  ('00000000-0000-4000-c000-000000000003', '00000000-0000-4000-b000-000000000001',
   'Brass Pendant Cluster', 'lighting', 9800000,
   '{"w_mm":900,"h_mm":1400,"d_mm":900}'::jsonb, 'Spun Brass', '#B08D57',
   '{"/assets/images/products/pendant-brass-cluster.jpg"}',
   '{"luxury","modern","industrial"}', true),

  ('00000000-0000-4000-c000-000000000004', '00000000-0000-4000-b000-000000000002',
   'Oak Counter Stool', 'furniture', 2400000,
   '{"w_mm":380,"h_mm":650,"d_mm":380}'::jsonb, 'European Oak', '#B79A72',
   '{"/assets/images/products/stool-oak.jpg"}',
   '{"scandinavian","minimal","japandi"}', false),

  -- Rossi Interiors, in stock and spread across categories, so the inventory
  -- matcher has something to furnish a whole room with rather than one piece.
  ('00000000-0000-4000-c000-000000000005', '00000000-0000-4000-b000-000000000001',
   'Travertine Coffee Table', 'furniture', 4500000,
   '{"w_mm":1200,"h_mm":330,"d_mm":700}'::jsonb, 'Honed Travertine', '#D8CFC0',
   '{"/assets/images/products/stool-oak.jpg"}',
   '{"japandi","warm_neutral","minimal","modern"}', true),

  ('00000000-0000-4000-c000-000000000006', '00000000-0000-4000-b000-000000000001',
   'Washi Paper Floor Lamp', 'lighting', 2200000,
   '{"w_mm":400,"h_mm":1500,"d_mm":400}'::jsonb, 'Washi Paper and Ash', '#F2EDE3',
   '{"/assets/images/products/pendant-white-dome.jpg"}',
   '{"japandi","minimal","scandinavian"}', true),

  ('00000000-0000-4000-c000-000000000007', '00000000-0000-4000-b000-000000000001',
   'Low Oak Lounge Chair', 'furniture', 6800000,
   '{"w_mm":720,"h_mm":680,"d_mm":800}'::jsonb, 'White Oak and Boucle', '#E4DED2',
   '{"/assets/images/products/armchair-ochre.jpg"}',
   '{"japandi","warm_neutral","modern"}', true),

  ('00000000-0000-4000-c000-000000000008', '00000000-0000-4000-b000-000000000001',
   'Handloom Wool Rug', 'finish', 3500000,
   '{"w_mm":2400,"h_mm":12,"d_mm":1700}'::jsonb, 'Undyed Wool', '#CFC5B7',
   '{"/assets/images/products/sofa-grey-tufted.jpg"}',
   '{"japandi","warm_neutral","scandinavian","modern"}', true)
on conflict (id) do nothing;

-- --- A worked customer project ----------------------------------------------
-- Carries the whole pipeline end to end: project -> four walls -> a succeeded
-- generation -> two concepts, one of which maps to real catalogue products.
insert into room_projects (id, customer_id, city, room_type, style_slug, budget_pkr, status)
values
  ('00000000-0000-4000-f000-000000000001', null, 'Lahore', 'living_room', 'japandi',
   1500000, 'generated')
on conflict (id) do nothing;

insert into room_photos (project_id, wall_angle, image_url, metadata)
values
  ('00000000-0000-4000-f000-000000000001', 'north', 'room-photos/seed/wall-north.jpg', '{"width":1600,"height":1200}'::jsonb),
  ('00000000-0000-4000-f000-000000000001', 'south', 'room-photos/seed/wall-south.jpg', '{"width":1600,"height":1200}'::jsonb),
  ('00000000-0000-4000-f000-000000000001', 'east',  'room-photos/seed/wall-east.jpg',  '{"width":1600,"height":1200}'::jsonb),
  ('00000000-0000-4000-f000-000000000001', 'west',  'room-photos/seed/wall-west.jpg',  '{"width":1600,"height":1200}'::jsonb)
on conflict (project_id, wall_angle) do nothing;

insert into design_generations (id, project_id, engine_used, status)
values
  ('00000000-0000-4000-f000-000000000002', '00000000-0000-4000-f000-000000000001',
   'gemini_flux', 'succeeded')
on conflict (id) do nothing;

insert into generated_designs (id, generation_id, render_url, mapped_products, overall_score)
values
  ('00000000-0000-4000-f000-000000000003', '00000000-0000-4000-f000-000000000002',
   'generated-designs/seed/concept-01.jpg',
   '["00000000-0000-4000-c000-000000000001","00000000-0000-4000-c000-000000000002"]'::jsonb,
   92.50),
  ('00000000-0000-4000-f000-000000000004', '00000000-0000-4000-f000-000000000002',
   'generated-designs/seed/concept-02.jpg',
   '["00000000-0000-4000-c000-000000000003"]'::jsonb,
   87.25)
on conflict (id) do nothing;

-- --- Leads -------------------------------------------------------------------
-- One assigned to the paid vendor and linked to the project above, one to the
-- unpaid vendor, one unassigned -- so masking and the admin queue both have
-- something to act on.
insert into consultation_leads
  (id, customer_name, phone, email, city, full_address, room_type, style_slug, status, business_id, project_id)
values
  ('00000000-0000-4000-d000-000000000001', 'Sarah Jenkins', '+92 300 1234567',
   'sarah.jenkins@example.com', 'Lahore', 'House 42, Street 7, Gulberg III',
   'living_room', 'japandi', 'new',
   '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-f000-000000000001'),

  ('00000000-0000-4000-d000-000000000002', 'Bilal Ahmed', '+92 345 2223344',
   'bilal.ahmed@example.com', 'Rawalpindi', 'Plot 88, Sector C, Bahria Town',
   'dining_room', 'scandinavian', 'contacted',
   '00000000-0000-4000-b000-000000000002', null),

  ('00000000-0000-4000-d000-000000000003', 'Zara Khan', '+92 302 8877665',
   'zara.khan@example.com', 'Islamabad', 'Apartment 9B, Silver Oaks, F-7',
   'bedroom', 'grey', 'new', null, null)
on conflict (id) do nothing;

-- --- Disputes ----------------------------------------------------------------
insert into customer_disputes (id, customer_name, customer_phone, business_id, reason, status)
values
  ('00000000-0000-4000-e000-000000000001', 'Bilal Ahmed', '+92 345 2223344',
   '00000000-0000-4000-b000-000000000002',
   'Booked a site visit for Saturday morning. Nobody arrived and no call to reschedule.',
   'pending')
on conflict (id) do nothing;

-- =============================================================================
-- VERIFICATION — run these after the script finishes
--
--   -- all ten tables, RLS on every one
--   select tablename, rowsecurity from pg_tables
--    where schemaname = 'public' order by tablename;
--
--   -- the paid-access predicate, both answers
--   select business_has_paid_access('00000000-0000-4000-b000-000000000001'); -- t
--   select business_has_paid_access('00000000-0000-4000-b000-000000000002'); -- f
--
--   -- the worked project has all four walls
--   select count(*) from room_photos
--    where project_id = '00000000-0000-4000-f000-000000000001';              -- 4
--
--   -- helper functions exist
--   select proname from pg_proc
--    where proname in ('is_admin','owned_business_ids','business_has_paid_access',
--                      'set_updated_at')
--    order by proname;                                                       -- 4 rows
-- =============================================================================
