-- =============================================================================
-- KANSO — MASTER BASELINE SCHEMA
-- 20260909_master_baseline_schema.sql
--
-- Builds the Customer, Vendor and Admin domains from absolute scratch.
-- Safe to paste straight into the Supabase SQL Editor, and safe to run again:
-- every statement is idempotent, so a re-run changes nothing.
--
-- Tables are created in dependency order, so there is no forward reference:
--   profiles -> businesses -> business_products
--                          -> consultation_leads
--                          -> business_subscriptions
--                          -> customer_disputes
--
-- -----------------------------------------------------------------------------
-- READ BEFORE RUNNING IN PRODUCTION
--
-- 1. ROW LEVEL SECURITY IS NOT ENABLED HERE.
--    Supabase exposes every table in this schema through PostgREST using the
--    anon key, which ships in the browser bundle. Until RLS policies exist,
--    anyone holding that key can read and write these tables directly.
--    That is acceptable while the backend is the only client (it uses the
--    service-role key), and MUST be closed before any public launch.
--
-- 2. THE SEED BLOCK AT THE BOTTOM CREATES A LOGIN-CAPABLE ADMIN ACCOUNT
--    with a known password. It is for local and staging use. Delete that
--    block, or rotate the password immediately, before running in production.
-- =============================================================================

-- Required for gen_random_uuid() and crypt(). Present on Supabase by default.
create extension if not exists pgcrypto;

-- =============================================================================
-- SECTION 1 — ENUM TYPES
--
-- CREATE TYPE has no IF NOT EXISTS, so each is guarded. Re-running is a no-op
-- rather than an error.
-- =============================================================================

do $$
begin
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
end
$$;

-- =============================================================================
-- SHARED TRIGGER — keeps updated_at honest
-- =============================================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- SECTION 2 — MASTER TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 2.1 profiles
--
-- One row per auth.users row. `role` is the authorisation source of truth and
-- is only ever read server-side -- never trusted from a request payload.
-- -----------------------------------------------------------------------------
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  full_name  text,
  role       user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on profiles (role);

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

comment on table profiles is
  'Application-side user record, 1:1 with auth.users. profiles.role is the only trusted source of authorisation.';

-- -----------------------------------------------------------------------------
-- 2.2 businesses
--
-- owner_id is nullable on purpose: an admin can register a partner before that
-- partner has an account, and sample rows can exist without an auth user.
--
-- is_active and is_banned are separate flags because they mean different
-- things. Disabling is administrative housekeeping and is reversible by the
-- same hand; a ban is a sanction that carries a reason. Collapsing them into
-- one boolean loses the answer to "why is this account off?".
-- -----------------------------------------------------------------------------
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

create index if not exists businesses_owner_idx on businesses (owner_id);
create index if not exists businesses_city_trade_idx on businesses (city, trade);
-- Partial index: the lead-routing query only ever looks for bookable vendors.
create index if not exists businesses_bookable_idx
  on businesses (city)
  where is_active and not is_banned and verified_at is not null;

drop trigger if exists businesses_set_updated_at on businesses;
create trigger businesses_set_updated_at
  before update on businesses
  for each row execute function set_updated_at();

comment on column businesses.verified_at is
  'Null until an admin verifies the business. Unverified businesses never receive leads, regardless of what they have paid.';

-- -----------------------------------------------------------------------------
-- 2.3 business_products — vendor inventory, and the AI retrieval corpus
--
-- price_minor is an integer in the smallest currency unit (PKR paisa). Never a
-- float: binary floating point cannot represent 0.01 exactly, and a catalogue
-- gets summed and compared.
-- -----------------------------------------------------------------------------
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

create index if not exists business_products_business_active_idx
  on business_products (business_id, is_active);

-- SECTION 3.1 — GIN index for style-tag retrieval. This is what makes
-- `where style_tags && array['japandi','minimal']` fast enough to run inside
-- the generation pipeline instead of as a batch job.
create index if not exists business_products_style_tags_gin
  on business_products using gin (style_tags);

drop trigger if exists business_products_set_updated_at on business_products;
create trigger business_products_set_updated_at
  before update on business_products
  for each row execute function set_updated_at();

comment on column business_products.price_minor is
  'Price in PKR paisa. 8500000 = PKR 85,000. Integer arithmetic only.';
comment on column business_products.style_tags is
  'Join key to a project style. Must use the same vocabulary the customer wizard writes, or a style silently stops matching.';

-- -----------------------------------------------------------------------------
-- 2.4 consultation_leads
--
-- business_id is ON DELETE SET NULL, not CASCADE: if a vendor account is
-- removed the lead returns to the admin queue. Deleting the customer's request
-- because a vendor left would destroy the customer's record of asking.
-- -----------------------------------------------------------------------------
create table if not exists consultation_leads (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null check (length(trim(customer_name)) > 0),
  phone         text not null,
  email         text,
  city          text default 'Lahore',
  full_address  text,
  room_type     text,
  style_slug    text,
  status        lead_status not null default 'new',
  business_id   uuid references businesses(id) on delete set null,
  unlocked_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists consultation_leads_business_status_idx
  on consultation_leads (business_id, status);
create index if not exists consultation_leads_created_idx
  on consultation_leads (created_at desc);
-- The admin queue: unassigned leads are the ones reaching nobody.
create index if not exists consultation_leads_unassigned_idx
  on consultation_leads (created_at desc)
  where business_id is null;

drop trigger if exists consultation_leads_set_updated_at on consultation_leads;
create trigger consultation_leads_set_updated_at
  before update on consultation_leads
  for each row execute function set_updated_at();

comment on column consultation_leads.unlocked_at is
  'When a paying business first revealed the contact details. Append-only in practice: an unlock cannot be undone, so a later billing dispute has a record.';

-- -----------------------------------------------------------------------------
-- 2.5 business_subscriptions
--
-- One row per business, enforced by the UNIQUE on business_id: upgrades mutate
-- the row rather than stacking new ones, so "what is this vendor paying for?"
-- has exactly one answer.
-- -----------------------------------------------------------------------------
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

create index if not exists business_subscriptions_status_idx
  on business_subscriptions (status, current_period_end);

drop trigger if exists business_subscriptions_set_updated_at on business_subscriptions;
create trigger business_subscriptions_set_updated_at
  before update on business_subscriptions
  for each row execute function set_updated_at();

-- -----------------------------------------------------------------------------
-- 2.6 customer_disputes
-- -----------------------------------------------------------------------------
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

create index if not exists customer_disputes_business_idx
  on customer_disputes (business_id, status);
create index if not exists customer_disputes_open_idx
  on customer_disputes (created_at desc)
  where status in ('pending', 'reviewing');

drop trigger if exists customer_disputes_set_updated_at on customer_disputes;
create trigger customer_disputes_set_updated_at
  before update on customer_disputes
  for each row execute function set_updated_at();

-- =============================================================================
-- SECTION 3.2 — PAID ACCESS PREDICATE
--
-- The single definition of "may this business see a lead's contact details".
-- Every endpoint and every future RLS policy must go through this, so the rule
-- cannot drift between the database and the application.
--
-- Deliberate choices:
--   past_due  does NOT grant access — a failed card closes the gate now,
--             not at the end of the period.
--   canceled  DOES still grant access until current_period_end, because the
--             vendor already paid for the month in hand. Cancelling is a
--             request not to renew, not a forfeit.
--   banned / inactive businesses are refused regardless of what they paid.
-- =============================================================================

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
-- SECTION 3.3 — SEED DATA
--
-- Everything below is idempotent (ON CONFLICT DO NOTHING) and uses fixed UUIDs
-- so re-running does not duplicate rows.
--
-- DELETE THIS ENTIRE SECTION BEFORE RUNNING AGAINST PRODUCTION.
-- =============================================================================

-- --- Admin account -----------------------------------------------------------
-- profiles.id references auth.users, so the auth row has to exist first.
-- Supabase's SQL editor runs as a superuser, which is the only reason this is
-- possible; it is a seeding convenience, not a pattern to copy into app code.
--
-- Credentials:  admin@kanso.pk  /  ChangeMe!Kanso2026
-- Change the password on first login.
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
    raise notice 'Skipped auth.users seed: not enough privilege. Create the admin via Supabase Auth, then insert its profiles row.';
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
   '{"scandinavian","minimal","japandi"}', false)
on conflict (id) do nothing;

-- --- Leads -------------------------------------------------------------------
-- One assigned to the paid vendor, one to the unpaid vendor, one unassigned --
-- so the masking rule and the admin queue both have something to act on.
insert into consultation_leads
  (id, customer_name, phone, email, city, full_address, room_type, style_slug, status, business_id)
values
  ('00000000-0000-4000-d000-000000000001', 'Sarah Jenkins', '+92 300 1234567',
   'sarah.jenkins@example.com', 'Lahore', 'House 42, Street 7, Gulberg III',
   'living_room', 'japandi', 'new', '00000000-0000-4000-b000-000000000001'),

  ('00000000-0000-4000-d000-000000000002', 'Bilal Ahmed', '+92 345 2223344',
   'bilal.ahmed@example.com', 'Rawalpindi', 'Plot 88, Sector C, Bahria Town',
   'dining_room', 'scandinavian', 'contacted', '00000000-0000-4000-b000-000000000002'),

  ('00000000-0000-4000-d000-000000000003', 'Zara Khan', '+92 302 8877665',
   'zara.khan@example.com', 'Islamabad', 'Apartment 9B, Silver Oaks, F-7',
   'bedroom', 'grey', 'new', null)
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
-- DONE.
--
-- Quick check after running:
--   select business_has_paid_access('00000000-0000-4000-b000-000000000001');  -- t
--   select business_has_paid_access('00000000-0000-4000-b000-000000000002');  -- f
-- =============================================================================
