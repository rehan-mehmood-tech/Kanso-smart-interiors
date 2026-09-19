-- Create a profiles row for every auth.users row.
--
-- profiles.role is the only trusted source of authorisation (see the baseline
-- schema's comment on the table), which means a signed-up user with no profile
-- row cannot be authorised for anything -- every request from them would fail
-- the role lookup. Supabase Auth writes to auth.users; nothing was writing the
-- matching profiles row, so the two tables drifted apart from the first signup.
--
-- The trigger closes that gap at the database layer rather than in application
-- code, so it holds no matter which path creates the user: the API, the
-- Supabase dashboard, or a password-reset flow that provisions an account.
--
-- Safe to re-run, and safe against a live database: the backfill at the end is
-- an idempotent insert of only the rows that are missing.

-- SECURITY DEFINER because the trigger runs as the caller (the anon or
-- authenticated role during signup), which has no rights to insert into
-- profiles. The search_path is pinned so the function body cannot be
-- redirected by a caller-controlled search_path -- a standard precaution for
-- any definer-rights function.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    -- Supabase stores signup metadata under raw_user_meta_data. The form sends
    -- `full_name`; `name` is accepted too so a different client shape still
    -- lands a display name instead of null.
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    -- Role is NEVER taken from user metadata: that value is client-writable at
    -- signup, so honouring it would let anyone mint an admin account. Every
    -- self-service signup is a customer. Business and admin roles are assigned
    -- server-side by an admin, per PRD s19.
    'customer'
  )
  -- A profile may already exist when an admin pre-registered the account.
  -- Keep the existing row, including whatever role was deliberately set on it.
  on conflict (id) do nothing;

  return new;
end;
$$;

comment on function handle_new_user() is
  'Mirrors each new auth.users row into profiles with role=customer. Role is never read from client-supplied metadata.';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill accounts created before this trigger existed, so they can
-- authenticate instead of failing the role lookup forever.
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name'
  ),
  'customer'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
  -- profiles.email is NOT NULL UNIQUE; an auth row without one cannot be
  -- represented and is skipped rather than aborting the whole backfill.
  and u.email is not null
on conflict (id) do nothing;
