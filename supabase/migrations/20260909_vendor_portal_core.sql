-- =============================================================================
-- Kanso Vendor Portal — core schema
-- 20260909_vendor_portal_core.sql
--
-- Adds account types, crew seats, product inventory, subscriptions, and the
-- paid-access gate that decides whether a business may see a lead's contact
-- details.
--
-- PREREQUISITE: this migration ALTERs `businesses` and `consultation_leads`,
-- and references `profiles` and `room_projects`. Those four tables come from
-- the PRD baseline schema (§15), which has NOT been written yet — this file
-- will fail on a fresh project until that baseline migration exists and runs
-- first. Every column it reads is defined in the PRD; the only columns it adds
-- to baseline tables are businesses.verified_at, consultation_leads.city and
-- consultation_leads.customer_email, none of which the PRD already defines.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Account types and crew support
-- -----------------------------------------------------------------------------

create type business_kind as enum ('solo_tradesman', 'shop_with_crew');

create type trade_category as enum (
  'furniture_store',
  'carpenter',
  'plumber',
  'electrician',
  'painter',
  'joiner',
  'lighting',
  'flooring',
  'other'
);

alter table businesses
  add column kind          business_kind  not null default 'solo_tradesman',
  add column trade         trade_category not null default 'other',
  -- Cities / neighbourhoods this business will travel to; used for lead feeds.
  add column service_areas text[]         not null default '{}',
  -- Null until an admin verifies the business. Unverified businesses never
  -- receive leads, regardless of what they have paid.
  add column verified_at   timestamptz;

create index businesses_kind_trade_idx on businesses (kind, trade);
create index businesses_service_areas_idx on businesses using gin (service_areas);

-- Seats. A solo tier is enforced by a row cap in `business_subscriptions.seats`,
-- not by schema, so a solo tradesman can upgrade without a migration.
create table business_members (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  profile_id  uuid not null references profiles(id)   on delete cascade,
  role        text not null default 'staff' check (role in ('owner', 'staff')),
  created_at  timestamptz not null default now(),
  unique (business_id, profile_id)
);

create index business_members_profile_idx on business_members (profile_id);

-- Exactly one owner per business.
create unique index business_members_one_owner_idx
  on business_members (business_id)
  where role = 'owner';

comment on table business_members is
  'Staff seats for a business. Seat count is capped by the active subscription tier.';

-- -----------------------------------------------------------------------------
-- 2. Product inventory
--
-- The AI pipeline retrieves from this table so generated concepts can specify
-- items the customer can actually buy locally, rather than generic furniture.
-- -----------------------------------------------------------------------------

create table business_products (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references businesses(id) on delete cascade,
  name         text not null check (length(trim(name)) > 0),
  category     text not null,          -- furniture | lighting | finish | fixture
  description  text,
  -- Money as an integer in the smallest unit (PKR paisa). Never a float.
  price_minor  bigint check (price_minor is null or price_minor >= 0),
  currency     char(3) not null default 'PKR',
  dimensions   jsonb,                  -- { "w_mm": 1800, "h_mm": 750, "d_mm": 900 }
  material     text,
  colour_hex   text check (colour_hex is null or colour_hex ~* '^#[0-9a-f]{6}$'),
  -- Paths inside the private `business-products` storage bucket, not URLs.
  image_paths  text[] not null default '{}',
  in_stock     boolean not null default true,
  is_active    boolean not null default true,
  -- Retrieval key for the Gemini spatial brief → Flux render step. Values come
  -- from the same eight-style vocabulary the customer wizard uses, so a product
  -- and a project match on a shared term.
  style_tags   text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index business_products_business_active_idx
  on business_products (business_id, is_active);

create index business_products_style_tags_idx
  on business_products using gin (style_tags);

comment on column business_products.price_minor is
  'Price in the smallest currency unit (PKR paisa). Integer arithmetic only.';

-- -----------------------------------------------------------------------------
-- 3. Subscriptions and the paid-access predicate
-- -----------------------------------------------------------------------------

create type sub_tier   as enum ('free', 'solo_tradesman', 'shop_crew');
create type sub_status as enum ('trialing', 'active', 'past_due', 'canceled', 'expired');

create table business_subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  business_id        uuid not null references businesses(id) on delete cascade,
  tier               sub_tier   not null default 'free',
  status             sub_status not null default 'expired',
  seats              int not null default 1 check (seats >= 1),
  current_period_end timestamptz,
  provider           text,             -- stripe | manual
  provider_ref       text,             -- provider-side subscription id
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- One subscription row per business; upgrades mutate it rather than stacking.
create unique index business_subscriptions_business_idx
  on business_subscriptions (business_id);

-- The single definition of "is this business paid up". Every RLS policy and
-- every API endpoint must go through this, so the rule cannot drift.
--
-- `past_due` deliberately does NOT grant access: a failed card closes the gate
-- at the next request rather than at the end of the period.
--
-- `canceled` DOES still grant access until current_period_end, because the
-- vendor has already paid for the remainder of the month. Cancelling is a
-- request not to renew, not a forfeit of the period in hand.
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
    where s.business_id = b_id
      and s.tier <> 'free'
      and (
        s.status in ('trialing', 'active')
        or (s.status = 'canceled' and s.current_period_end is not null)
      )
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

comment on function business_has_paid_access(uuid) is
  'True when the business holds a paid subscription that has not lapsed: trialing, active, or canceled-but-still-within-the-paid-period.';

-- Whether the current user owns a given business.
--
-- SECURITY DEFINER matters here: a policy on business_members that queries
-- business_members inline re-enters its own policy, and Postgres raises
-- "infinite recursion detected in policy for relation". Resolving ownership
-- inside a definer function runs the lookup with RLS bypassed, so the policy
-- evaluates once.
create or replace function is_business_owner(b_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from business_members m
    where m.business_id = b_id
      and m.profile_id = auth.uid()
      and m.role = 'owner'
  )
  or exists (
    select 1
    from businesses b
    where b.id = b_id
      and b.owner_profile_id = auth.uid()
  );
$$;

-- Businesses the current auth user belongs to. Used by every policy below.
create or replace function current_user_business_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select m.business_id
  from business_members m
  join profiles p on p.id = m.profile_id
  where p.id = auth.uid()
  union
  select b.id
  from businesses b
  where b.owner_profile_id = auth.uid();
$$;

-- -----------------------------------------------------------------------------
-- 4. Lead unlock ledger
-- -----------------------------------------------------------------------------

alter table consultation_leads
  add column unlocked_by_business_id uuid references businesses(id),
  add column unlocked_at             timestamptz,
  -- The masked view needs a coarse location it can always show, separate from
  -- the precise address it must withhold. `location` remains the full address.
  add column city                    text,
  add column customer_email          text;

create index consultation_leads_unlocked_idx
  on consultation_leads (unlocked_by_business_id)
  where unlocked_by_business_id is not null;

comment on column consultation_leads.unlocked_at is
  'When a paying business first revealed the contact details. Append-only audit trail: an unlock cannot be undone, so a later refund dispute has a record.';

-- -----------------------------------------------------------------------------
-- 5. Row level security
-- -----------------------------------------------------------------------------

alter table business_members       enable row level security;
alter table business_products      enable row level security;
alter table business_subscriptions enable row level security;

-- Members: readable by the business's own people.
create policy business_members_read on business_members
  for select using (business_id in (select current_user_business_ids()));

-- Only an owner manages seats.
--
-- Bootstrap note: the FIRST owner row cannot be inserted through this policy,
-- because no owner exists yet to authorise it. Registration creates that row
-- with the service-role key, which bypasses RLS. The `businesses.owner_profile_id`
-- arm of is_business_owner() then lets that owner add the rest of the crew.
create policy business_members_write on business_members
  for all
  using (is_business_owner(business_members.business_id))
  with check (is_business_owner(business_members.business_id));

-- Inventory: a business reads and writes only its own products.
create policy business_products_owner on business_products
  for all using (business_id in (select current_user_business_ids()))
  with check (business_id in (select current_user_business_ids()));

-- Active products are readable service-side for AI retrieval across all
-- verified businesses; customers never query this table directly.
create policy business_products_read_active on business_products
  for select using (
    is_active
    and exists (
      select 1 from businesses b
      where b.id = business_products.business_id
        and b.verified_at is not null
    )
  );

-- Subscriptions: readable by the business, writable only by the service role
-- (billing webhooks). No policy grants INSERT/UPDATE to end users by design.
create policy business_subscriptions_read on business_subscriptions
  for select using (business_id in (select current_user_business_ids()));

-- -----------------------------------------------------------------------------
-- 6. leads_masked — the paywall
--
-- Contact details are withheld in the QUERY, not in the UI. An unpaid business
-- receives NULL from Postgres, so the value never enters the API response and
-- cannot be recovered from the network tab or the RSC payload.
--
-- security_invoker means the caller's RLS on consultation_leads still applies,
-- so a business sees only rows assigned to it.
-- -----------------------------------------------------------------------------

create or replace view leads_masked
with (security_invoker = true)
as
select
  l.id,
  l.business_id,
  l.name                   as customer_name,
  l.city,
  rp.room_type,
  rp.style_id              as style_slug,
  l.status,
  l.created_at,

  -- Gated fields. NULL unless the assigned business is paid up.
  case when business_has_paid_access(l.business_id) then l.phone           end as phone,
  case when business_has_paid_access(l.business_id) then l.customer_email  end as email,
  case when business_has_paid_access(l.business_id) then l.location        end as full_address,
  case when business_has_paid_access(l.business_id) then l.message         end as message,

  -- Lets the client render an upgrade prompt without guessing why a field is
  -- empty, and distinguishes "not paid" from "customer left it blank".
  business_has_paid_access(l.business_id) as is_unlocked
from consultation_leads l
join room_projects rp on rp.id = l.project_id;

comment on view leads_masked is
  'Lead feed for the vendor portal. Contact columns resolve to NULL unless business_has_paid_access() passes. Query this instead of consultation_leads from any business-facing endpoint.';

commit;
