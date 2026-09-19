-- Snapshot the chosen concept and the customer onto the lead.
--
-- PRD s15.10 specifies both `selected_design_id` and `customer_id` on
-- `consultation_leads`; the baseline schema has neither. Today the lead reaches
-- the design only by joining back through room_projects, which means:
--
--   * the vendor's lead detail cannot show "the concept they picked" without a
--     two-hop join that silently returns nothing if the project is deleted; and
--   * if the customer later selects a different concept, the lead retroactively
--     changes to point at the new one -- the vendor's record of what was agreed
--     rewrites itself underneath them.
--
-- Snapshotting is the whole point of s15.10's note on name/phone/location: the
-- lead is a record of what was submitted at that moment.
--
-- Safe to re-run, and safe against live leads: both columns are nullable, so
-- existing rows stay valid.

alter table consultation_leads
  add column if not exists selected_design_id uuid
    references generated_designs(id) on delete set null,
  add column if not exists customer_id uuid
    references profiles(id) on delete set null;

comment on column consultation_leads.selected_design_id is
  'The concept the customer chose when they submitted. A snapshot: it does not follow later changes to room_projects.selected_design_id.';
comment on column consultation_leads.customer_id is
  'The authenticated customer who submitted the lead (PRD s15.10). Nullable for leads captured outside the wizard.';

create index if not exists consultation_leads_customer_idx
  on consultation_leads (customer_id);

-- Backfill from the linked project so existing leads are not left blank.
-- Only where the project still has a selection to copy.
update consultation_leads l
set selected_design_id = p.selected_design_id,
    customer_id        = coalesce(l.customer_id, p.customer_id)
from room_projects p
where l.project_id = p.id
  and l.selected_design_id is null;
