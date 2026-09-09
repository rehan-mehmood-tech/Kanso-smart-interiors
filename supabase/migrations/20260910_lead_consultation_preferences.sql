-- Consultation preferences on a lead.
--
-- The booking form asks how the customer wants to be seen (on site or over
-- video), roughly when, and whether there is anything the specialist should
-- know before arriving. The baseline schema had nowhere to put any of it, so
-- the answers were collected and discarded.
--
-- Safe to run more than once, and safe to run against a database with live
-- leads: every column is nullable, so existing rows stay valid.

alter table consultation_leads
  add column if not exists preferred_mode      text,
  add column if not exists preferred_time_slot text,
  add column if not exists notes               text;

-- Constrained rather than free text: these drive scheduling, and a typo'd
-- value would quietly never match. Added separately from the columns so a
-- re-run does not fail on an existing constraint.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'consultation_leads_preferred_mode_check'
  ) then
    alter table consultation_leads
      add constraint consultation_leads_preferred_mode_check
      check (preferred_mode is null or preferred_mode in ('in-person', 'video'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'consultation_leads_preferred_time_slot_check'
  ) then
    alter table consultation_leads
      add constraint consultation_leads_preferred_time_slot_check
      check (preferred_time_slot is null or preferred_time_slot in ('Morning', 'Afternoon', 'Evening'));
  end if;
end $$;

comment on column consultation_leads.preferred_mode is
  'How the customer wants the consultation: in-person or video.';
comment on column consultation_leads.preferred_time_slot is
  'Rough window the customer prefers. The specialist confirms an exact time.';
comment on column consultation_leads.notes is
  'Access instructions and constraints, in the customer''s own words.';
