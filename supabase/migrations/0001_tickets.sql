-- TicketPath — tickets, violations reference data, and RLS.
-- Serves PRD Stories 1, 2, 5 and 6. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- Reference data: sourced violations (architecture §3)
-- Public read, nobody writes through the API. Every row carries its source
-- and the date it was last checked (PRD §7).
-- ---------------------------------------------------------------------------
create table if not exists public.violations (
  code                  text primary key,
  label                 text not null,
  points                smallint not null,
  -- Null where the fine range isn't sourced yet. PRD §3: only VTL §1180
  -- speeding is sourced end to end; the rest must refuse, not guess.
  fine_min              numeric(10, 2),
  fine_max              numeric(10, 2),
  speed_over_min        smallint,
  speed_over_max        smallint,
  source_url            text not null,
  verified_on           date not null
);

comment on table public.violations is
  'Sourced NY violation data. Every displayed number traces to source_url + verified_on.';

insert into public.violations
  (code, label, points, fine_min, fine_max, speed_over_min, speed_over_max, source_url, verified_on)
values
  ('speed-1-10',   'Speeding, 1–10 mph over the limit',  3,  45.00, 150.00,  1, 10,
   'https://www.nysenate.gov/legislation/laws/VAT/1180', '2026-09-27'),
  ('speed-11-20',  'Speeding, 11–20 mph over the limit', 4,  90.00, 300.00, 11, 20,
   'https://www.nysenate.gov/legislation/laws/VAT/1180', '2026-09-27'),
  ('speed-21-30',  'Speeding, 21–30 mph over the limit', 6,  90.00, 300.00, 21, 30,
   'https://www.nysenate.gov/legislation/laws/VAT/1180', '2026-09-27'),
  ('speed-31-40',  'Speeding, 31–40 mph over the limit', 8, 180.00, 600.00, 31, 40,
   'https://www.nysenate.gov/legislation/laws/VAT/1180', '2026-09-27'),
  ('speed-41-plus','Speeding, more than 40 mph over',   11, 180.00, 600.00, 41, 999,
   'https://www.nysenate.gov/legislation/laws/VAT/1180', '2026-09-27'),
  -- Points sourced; fine ranges deliberately null (not yet looked up — PRD §3).
  ('traffic-device', 'Disobeying a traffic signal or device', 3, null, null, null, null,
   'https://dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system', '2026-09-27'),
  ('stop-sign',      'Failure to stop at a stop sign',        3, null, null, null, null,
   'https://dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system', '2026-09-27'),
  ('follow-close',   'Following too closely',                 4, null, null, null, null,
   'https://dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system', '2026-09-27')
on conflict (code) do nothing;

alter table public.violations enable row level security;

drop policy if exists "violations are readable by everyone" on public.violations;
create policy "violations are readable by everyone"
  on public.violations for select
  using (true);
-- No insert/update/delete policies: writes happen through migrations only.

-- ---------------------------------------------------------------------------
-- Saved tickets (PRD Story 6)
-- ---------------------------------------------------------------------------
create table if not exists public.tickets (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users (id) on delete cascade,

  -- Two-letter issuing state. PRD §5 scopes the product to New York; an
  -- out-of-state citation is refused at extraction and never gets this far,
  -- but the column records what was on the paper.
  issuing_state         text,

  violation_code        text references public.violations (code),
  violation_description text,
  charged_speed_mph     smallint,
  speed_limit_mph       smallint,

  issue_date            date,
  issue_time            text,
  location              text,

  officer_name          text,
  agency                text,

  court_name            text,
  court_address         text,
  appearance_date       date,

  -- Shown labeled "printed on your ticket", never summed into a total
  -- (PRD Story 5). Null when the ticket prints no amount.
  printed_fine_amount   numeric(10, 2),

  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- There is deliberately NO insurance / premium column. PRD Story 1 AC3 and
-- architecture §3: no column, nothing to show. Adding one needs a PRD change.

-- The DRA window query is "my tickets in the last 18 months".
create index if not exists tickets_user_issue_date_idx
  on public.tickets (user_id, issue_date desc);

alter table public.tickets enable row level security;

drop policy if exists "users read their own tickets"   on public.tickets;
drop policy if exists "users insert their own tickets" on public.tickets;
drop policy if exists "users update their own tickets" on public.tickets;
drop policy if exists "users delete their own tickets" on public.tickets;

create policy "users read their own tickets"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "users insert their own tickets"
  on public.tickets for insert
  with check (auth.uid() = user_id);

create policy "users update their own tickets"
  on public.tickets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users delete their own tickets"
  on public.tickets for delete
  using (auth.uid() = user_id);

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tickets_touch_updated_at on public.tickets;
create trigger tickets_touch_updated_at
  before update on public.tickets
  for each row execute function public.touch_updated_at();
