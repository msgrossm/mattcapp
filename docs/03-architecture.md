# TicketPath — Architecture (CP-M3)

*First draft 2026-10-16. Map: `docs/design/architecture-map.md`. Stack
decision: `docs/decisions/0001-stack.md`.*

## 1. What this covers

The MVP slice only: PRD §6 Stories 1–3 (know the points, know the cost as a
range, see pay vs. fight side by side) and the PRD §7 data and legal rules.
Everything in PRD §5 "out of scope" stays off the map: non-NY tickets, court
logistics, insurance percentages, recommendations, follow-up tracking.

## 2. The decision

**Next.js on Vercel** for the screens and the server routes, **Supabase
(Postgres)** for the sourced violation data, and the **Claude API** called
only from a Next.js route handler so the key never reaches the browser.
Reasoning and the rejected alternative are in decision record 0001.

What it buys: one framework that is both the front end and the server code
(route handlers), and a real Postgres database whose access rules live in the
database and leave with the data if I move off Supabase.

What it costs: see §6. The short version is two vendors to run instead of
one, and a free tier I have to keep an eye on.

## 3. Components, and the requirement each one serves

| Box | What it does | Requirement it serves |
|---|---|---|
| Phone browser | Shows the "Describe your ticket" questions and the result card | Stories 1–3. The PRD §4 persona is on a phone with 5–15 minutes of attention |
| Next.js pages (Vercel) | Draws the questions, the result card, and the empty, unsupported and error states | Stories 1–3. CLAUDE.md rule that every feature has an empty state and an error state |
| `/api/lookup` route handler (Vercel) | Takes the chosen violation, reads it from Supabase, and refuses if it isn't there | §7 data rule. Story 1 AC2 and Story 2 AC2 (say "I don't have reliable data on this yet", never guess) |
| `violations` table (Supabase) | One row per supported violation: code, plain-English name, points, fine min/max, `source_url`, `verified_on` | Story 1 AC1, Story 2 AC1. §7 rule that every number shows its source and last-verified date |
| `dra_rule` table (Supabase) | The Driver Responsibility Assessment trigger and amounts, with source and date | Story 2 AC1 (DRA trigger condition) |
| `supabase/seed.sql` (repo) | The sourced numbers from PRD §3 and §9, loaded by hand | §7 data rule. Keeps every number traceable to a commit and a source |

There is deliberately **no column for insurance impact**, so Story 1 AC3 ("never
displays a premium-increase figure") holds by construction: no column, nothing
to show.

## 4. Trace gaps: boxes from D06 with no PRD story yet

My D06 requirements list (case files, photo upload, guest-to-account sign-up,
admin view) and the Claude API are part of the stack decision, but **no story
in PRD §6 needs them yet.** Per the course rule, each one either gets a PRD
story or comes off the map. They're drawn dashed on the map until I decide.

| Box | Where it came from | What has to happen |
|---|---|---|
| ~~Claude API~~ | Concept brief stack guess; PRD §7 legal-drift risk | **Closed 2026-10-22.** PRD Story 5 ("read my ticket photo") now needs it. Scoped tightly by record 0002: the model reads what is printed on the paper and nothing else — points and fine ranges still come from the sourced tables, so §7 holds |
| ~~Supabase Auth (guest → account, case files)~~ | D06 requirements 1, 3, 4, 6, 7 | **Closed 2026-10-22.** PRD Story 6 needs an account to count points across the 18-month DRA window. Guest-to-account, per D06: scanning and lookup need no account, saving does |
| Supabase Storage (ticket photos) | D06 requirements 2, 5 | **Cut 2026-10-22.** Record 0002 discards the photo after extraction. No story needs the original image back, and keeping it would put a licence number and address at rest. Re-opening it needs a retention rule in the PRD first |
| Admin view | D06 requirement 8 | Still open. No story. Add one or cut |

Related: my D06 claim describes the product as "user photographs ticket and
gets advice." The photograph step is now in the PRD (Story 5), but **"advice"
still conflicts with the §7 legal line** — Story 5 produces a sourced
comparison, not a recommendation. That half of the framing still has to
change.

**One thing Stories 5 and 6 add to the map:** a ticket photo is the most
sensitive input the product takes, so the extraction prompt refuses to read
the driver's name, licence number, date of birth, address and plate number
even when they're plainly visible. Nothing we don't need is extracted, and
nothing at all is stored.

## 5. Request trace: Story 1, hop by hop

*"As a driver who's just gotten a ticket, I want to know how many points it
carries."* Example: speeding 11–20 mph over.

1. **Browser.** The user answers the questions on their phone and picks
   "Speeding, 11–20 over." The answers live only in page state. Nothing is
   saved.
2. **Browser → Vercel.** The page calls `GET /api/lookup?violation=speed-11-20`
   over HTTPS.
3. **Route handler → Supabase.** The handler runs
   `select … from violations where code = 'speed-11-20'` through `supabase-js`.
   It uses a key that can only read the `violations` and `dra_rule` tables
   (a row-level policy that allows read and nothing else).
4. **Supabase → route handler.** One of three things comes back:
   - **A row** (points 4, `source_url` = the dmv.ny.gov point table,
     `verified_on` = 2026-09-27). The handler returns it as JSON.
   - **No row.** The violation isn't supported. The handler returns
     `{ status: "unsupported" }` and never estimates (Story 1 AC2).
   - **An error or timeout.** The handler returns a 503.
5. **Vercel → browser.** The page draws one of three states:
   - the points card, with the source link and the last-verified date next to
     the number (Story 1 AC1);
   - the "I don't have reliable data on this yet" card;
   - the error state ("Couldn't reach our data, try again").
6. **What never happens.** No premium figure appears, because none exists
   anywhere in the system (Story 1 AC3).

Stories 2 and 3 follow the same path. The same row also carries
`fine_min`/`fine_max`, and the handler adds the `dra_rule` row. The page lays
out the pay path and the fight path side by side, with the fight path's
unknowns (lawyer cost, likely outcome) stated as unknowns.

## 6. What this costs

- **Two vendors.** Vercel and Supabase mean two dashboards, two sets of
  environment variables, and two free tiers to watch. I'm accepting that in
  exchange for Postgres and an easier exit.
- **Supabase free tier.** ⚠ Verify: I believe free projects pause when idle.
  That's fine for class but could break a live demo if I don't check before
  presenting.
- **An extra hop.** Sending lookups through a route handler, instead of
  having the browser query Supabase directly, adds a little latency. In
  exchange, the refusal rule lives in one place on the server, and so will
  the Claude key if Claude stays.
- **Hand-maintained data.** Every `verified_on` date goes stale, and nothing
  re-checks it automatically. Re-verifying is manual work, and the $93
  surcharge (PRD §8 Q4) already needs it.
- **Cost carried over from D06.** Supabase doesn't delete old guest case
  files on its own. This only matters if the case-file boxes in §4 survive.
- **Familiarity.** This is a cost, not a reason. I had never used Next.js or
  Supabase before this class, and I wrote the prototype with Claude, so I
  can't count plain JS either. I chose this stack after class discussion and
  after talking with classmates who are building similar products and have
  more front-end and backend-as-a-service experience. The cost is learning
  two new platforms in about five weeks.

## 7. Open before build

- Settle every trace gap in §4: add a story or cut the box.
- PRD §8 Q3 decisions that change the screens: what the refusal looks like
  (a blocked state, or a partial card with a gap callout), and whether there
  is one flow or two (quick resolver vs. deep investigator).

## Revision log

- 2026-10-16: first draft for CP-M3.
