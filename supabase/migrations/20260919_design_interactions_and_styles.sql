-- Like / Save / Select, and the style catalogue.
--
-- Three gaps in the baseline schema, all from PRD s15:
--
--   * `design_interactions` (s15.8) did not exist, so Like and Save had nowhere
--     to persist and were held in React state that died on navigation.
--   * `room_projects.selected_design_id` (s15.4) did not exist. The PRD names it
--     the authoritative record of which concept the customer chose, and the
--     consultation lead is meant to reference it.
--   * `styles` (s15.9) did not exist; the eight styles lived only in the
--     frontend, so `room_projects.style_slug` referenced nothing checkable.
--
-- Safe to re-run.

-- --- 1. selected_design_id ---------------------------------------------------
-- Nullable: a project has no selection until the customer makes one.
-- ON DELETE SET NULL so removing a concept clears the choice rather than
-- cascading away the whole project.
alter table room_projects
  add column if not exists selected_design_id uuid
    references generated_designs(id) on delete set null;

comment on column room_projects.selected_design_id is
  'The concept the customer chose. Authoritative per PRD s31; a design_interactions row of type select is analytics history only.';

-- --- 2. styles ---------------------------------------------------------------
-- Seed data, not an admin-managed CMS in V1 (PRD s15.9). `id` is the slug that
-- room_projects.style_slug already stores.
create table if not exists styles (
  id          text primary key,
  name        text not null,
  description text not null,
  image_path  text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

comment on table styles is
  'The style catalogue. Seeded by migration; matches apps/web/lib/project/catalog.ts.';

-- Values mirror STYLE_OPTIONS in the frontend catalogue. ON CONFLICT DO UPDATE
-- so re-running this migration corrects drift instead of silently skipping.
insert into styles (id, name, description, image_path, sort_order) values
  ('modern',       'Modern',       'Clean lines, neutral palette, and functional elegance.',   '/assets/images/styles/modern.jpg',            1),
  ('minimal',      'Minimal',      'Intentional simplicity emphasizing space and light.',      '/assets/images/styles/minimal.jpg',           2),
  ('scandinavian', 'Scandinavian', 'Hygge comfort blended with bright, functional design.',    '/assets/images/styles/scandinavian.jpg',      3),
  ('grey',         'Grey',         'Sophisticated monochromatic layers for a calm atmosphere.','/assets/images/styles/grey.jpg',              4),
  ('warm_neutral', 'Warm Neutral', 'Earthy, inviting tones providing grounded tranquility.',   '/assets/images/styles/warm-neutral.jpg',      5),
  ('industrial',   'Industrial',   'Raw materials, exposed elements, and urban edge.',         '/assets/images/styles/industrial.jpg',        6),
  ('luxury',       'Luxury',       'Premium materials, bespoke finishes, and refined details.','/assets/images/styles/luxury.jpg',            7),
  ('japandi',      'Japandi',      'Wabi-sabi simplicity meets Nordic warmth.',                '/assets/images/styles/japandi-wabi-sabi.jpg', 8)
on conflict (id) do update set
  name        = excluded.name,
  description = excluded.description,
  image_path  = excluded.image_path,
  sort_order  = excluded.sort_order;

-- --- 3. design_interactions --------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'interaction_type') then
    create type interaction_type as enum ('like', 'save', 'select');
  end if;
end $$;

-- project_id is denormalised here because `generated_designs` has no
-- project_id of its own (it reaches a project only through design_generations).
-- Without it, listing "everything this user saved on this project" would need a
-- two-hop join on every read, and the select-history rows could not be scoped
-- to a project at all.
create table if not exists design_interactions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles(id) on delete cascade,
  design_id        uuid not null references generated_designs(id) on delete cascade,
  project_id       uuid references room_projects(id) on delete cascade,
  interaction_type interaction_type not null,
  created_at       timestamptz not null default now()
);

comment on table design_interactions is
  'Like/Save/Select as discrete rows (PRD s15.8). Select rows are event history; room_projects.selected_design_id is authoritative.';

-- Makes like and save idempotent toggles: a double-tap cannot create a second
-- row, so "is this liked?" has exactly one answer. Deliberately NOT applied to
-- `select`, which is an append-only history of every choice the user made.
create unique index if not exists design_interactions_unique_toggle
  on design_interactions (user_id, design_id, interaction_type)
  where interaction_type in ('like', 'save');

create index if not exists design_interactions_user_project_idx
  on design_interactions (user_id, project_id);
create index if not exists design_interactions_design_idx
  on design_interactions (design_id);

-- --- 4. Row level security ---------------------------------------------------
alter table design_interactions enable row level security;
alter table styles              enable row level security;

-- A customer may only ever touch their own interaction rows.
drop policy if exists design_interactions_owner on design_interactions;
create policy design_interactions_owner on design_interactions
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- The catalogue is public reference data: readable by anyone, writable by no
-- one through the API. Changes come from a migration.
drop policy if exists styles_public_read on styles;
create policy styles_public_read on styles
  for select
  using (true);
