# TicketPath — Product Requirements Document (CP-M2)

## 1. Summary

TicketPath is a New York traffic-ticket explainer: a driver enters their
violation, and the product tells them the points, the fine range, and the
surcharge exposure, sourced and dated, so they can decide whether to pay,
fight, or call a lawyer — without guessing, and without an ad-farm ticket-
defense site or a confidently-wrong chatbot answering instead.

## 2. Current state — what a ticketed driver does today

*(Source tags: [I] = one of the three W03 interviews below, [A] = assumption /
personal experience, not yet independently validated.)*

- Pays by mail without knowing it carries points. **[A]** — from the concept
  brief; not directly said by any interview subject, though none of the three
  subjects paid without first trying to find out the cost/consequence, which
  is weak indirect support that "just pay blind" is the passive default for
  people who *don't* investigate.
- Googles the violation code and lands on ad-farm ticket-defense pages. **[I]**
  — the self-interview: "Google wasn't giving me good answers... official
  answers."
- Asks a parent, who may not know the answer. **[I]** — self-interview: dad's
  response was "you're going to have to figure it out yourself."
- **Asks the officer directly — not in the original brief, added from
  evidence.** **[I]** — self-interview: officer said insurance impact was
  "not his job... he has absolutely no clue about any of that."
- Asks a general chatbot that may answer confidently and wrongly. **[A]** —
  not directly evidenced by any of the three interviews; still plausible and
  consistent with the concept brief's core concern, but currently unproven.
- Calls multiple insurance companies with a hypothetical to get a real
  answer. **[I]** — self-interview: called several insurers, got quoted a
  ~30% increase with a renewal-cycle-dependent delay.
- Calls multiple lawyers for quotes before deciding. **[I]** — both the
  self-interview and the friend interview involved contacting/retaining a
  lawyer; the self-interview explicitly shopped several before choosing one.

## 3. Problem, quantified

| Claim | Number | Source | Status |
|---|---|---|---|
| NY assigns points per violation on a fixed schedule | Common violations (unchanged by the Feb 2026 amendment): speeding 1–10mph over = 3, 11–20 = 4, 21–30 = 6, 31–40 = 8, 40+ = 11; following too closely = 4; disobeying a signal/stop sign = 3. Nine *specific* violations changed 2/16/26 — e.g. Aggravated Unlicensed Operation 0→11, passing a stopped school bus 5→8, construction-zone speeding "based on speed"→flat 8, failure to exercise due care 2→5 — full old/new table in the DMV Commissioner's memo. | [dmv.ny.gov point table](https://dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system) (common violations) + [DMV Commissioner memo "P"2/"M"1 (2026), Jan 30 2026](https://www.ejustice.ny.gov/LawEnforcement/docs/dmv/P2M12026.pdf) (the 9 changed violations, primary regulatory source, signed by Commissioner Schroeder, citing 15 NYCRR §131.3–131.4) — verified 2026-09-27 | **Have**, for both the unchanged common violations and the 9 that changed 2/16/26 |
| NY's point system changed Feb 2026 — is it real and in effect? | **Resolved.** Confirmed by primary source: DMV regulatory amendments adopted 11/6/2024, published in the State Register 1/14/2026, enforceable for violations on/after 2/16/2026. Look-back period for persistent-violator administrative action extended 18mo→24mo. (The oft-repeated "11→10 point suspension threshold" figure is still only secondary-sourced — the primary memo confirms the look-back extension but its excerpted table doesn't itself state that specific number change.) | [DMV memo, as above](https://www.ejustice.ny.gov/LawEnforcement/docs/dmv/P2M12026.pdf) — verified 2026-09-27 | **Have** (memo) / **secondary-only** (the 10-point figure specifically) |
| NY charges a Driver Responsibility Assessment above a point threshold | 6+ points within 18 months (separate, unchanged threshold from the persistent-violator suspension rule above — these are two different NY mechanisms, easy to conflate). $100/yr for 6 points ($300 over 3 yrs); +$25/yr per additional point (+$75 over 3 yrs each). Alcohol/drug-related: $250/yr ($750 over 3 yrs). | [dmv.ny.gov/how-pay-driver-responsibility-assessment](https://dmv.ny.gov/how-pay-driver-responsibility-assessment) — verified 2026-09-27 | **Have** |
| Fine amounts per violation (dollar ranges) | VTL §1180 speeding, statutory text: ≤10mph over = $45–150; 11–30mph over = $90–300 (+ up to 15 days); >30mph over = $180–600 (+ up to 30 days). School-zone violations run higher. Plus a mandatory state surcharge, commonly cited at $93 outside NYC. | [NY Senate — VAT §1180 statute text](https://www.nysenate.gov/legislation/laws/VAT/1180) (fine ranges, verified 2026-09-27); surcharge figure via NYS Comptroller guidance, dated 2013 — **re-verify this one, it's the oldest source in this table** | **Have** for §1180 speeding specifically; **not yet done** for the other ~14 target violations — same statute-lookup method, just not completed this pass |
| Which violations are actually highest-volume (for the MVP violation list) | Real ranked counts, NY statewide, four-year window: SPEED IN ZONE (1,565,830), DISOBEYED TRAFFIC DEVICE (844,218), SPEED OVER 55 ZONE (630,109), OPERATING W/ PORTABLE ELECTRONIC DEVICE (357,043), FAILED TO STOP AT STOP SIGN (346,240), AGGRAVATED UNLICENSED OP 3RD MISD. (308,689), MOVED FROM LANE UNSAFELY/WEAVING (197,430), SPEED NOT REASONABLE AND PRUDENT (173,038), OPERATING W/ MOBILE PHONE (170,289), FAILED TO YIELD TO PEDESTRIAN/VEHICLE (147,980) — plus several high-count administrative violations (unlicensed operator, uninspected/unregistered vehicle, no insurance) that are common but don't fit the pay-vs-fight moving-violation job the same way. | [data.ny.gov "Traffic Tickets Issued: Four Year Window" (q4hy-kbtf)](https://data.ny.gov/Transportation/Traffic-Tickets-Issued-Four-Year-Window/q4hy-kbtf), queried directly via the Socrata API — verified 2026-09-27 | **Have** — this replaces a guess with a real ranking; the MVP violation list in §5 should be built from this, filtered to point-bearing moving violations |
| A first moving-violation conviction raises insurance premiums | One data point: ~30% increase, delayed until the subject's renewal cycle, per phone calls to insurers (not an NY policy, and not a published rate table) | W03 self-interview | **Anecdotal, single subject, non-NY policy — not generalizable** |
| Volume: tickets issued per year in a Syracuse-area county specifically | The statewide ranking above exists; not yet filtered to Onondaga County | Same data.ny.gov dataset supports this filter; not run this pass | **Have the data source, haven't run the query** |
| Awareness: share of drivers who don't know their violation carries points | — | No public figure found; likely requires primary data (a short SU student survey) | **No data yet — best candidate for primary research if time allows** |

## 4. Users & the job to be done

**Persona** (concept brief, unvalidated by a NY-specific interview — see
Open Questions): a Syracuse undergraduate, 19–22, just pulled over on I-81 or
Erie Boulevard, 5–15 minutes of attention before they give up and mail the
payment.

**Job:** When I get a traffic ticket in New York and can't tell how bad it
is, I want to understand the points, fines, and surcharges attached to my
specific violation, so I can decide whether to plead guilty by mail, request
a reduction, or find a lawyer.

**A nuance the three interviews surfaced that the brief didn't originally
have:** subjects split into two different response patterns to the same
uncertainty —

- **Quick resolver** (Dagi): wants the paper gone with minimum time spent,
  explicitly didn't research or compare options.
- **Deep investigator** (self; friend's father): spent months, hundreds of
  dollars, and multiple phone calls comparing pay-vs-fight before deciding.

Both patterns want the same underlying comparison — TicketPath's job is to
make that comparison instant and sourced, whether the user acts on it in two
minutes or two months.

## 5. Scope

### In scope (MVP)

- Point value lookup for the highest-volume NY point-bearing moving
  violations — per §3's real ranked data, that's speeding brackets,
  disobeying a traffic device, failure to stop at a stop sign, using a
  mobile phone/portable electronic device while driving, moving unsafely
  between lanes, and failure to yield to a pedestrian/vehicle, at minimum
  — each violation showing its point value, source link, and last-verified
  date. (The ranking also surfaced high-volume *administrative* violations —
  unlicensed operator, uninspected/unregistered vehicle, no insurance — that
  don't fit the pay-vs-fight moving-violation job the same way; decide
  explicitly whether to include them or hold them for a later pass.)
- Fine range lookup, same violation set — §1180 speeding is sourced
  end-to-end (statute text, §3); the remaining violations need the same
  statute-lookup pass before build, not a plausible-sounding guess.
- A pay-vs-fight cost comparison framed as a **structured comparison**, not
  a single verdict: points + fine range (once sourced) + DRA exposure vs. a
  labeled, ranged estimate of typical contest costs — never a single "you
  should do X."
- Explicit refusal behavior: any violation, court, or figure not in the
  sourced dataset gets an "I don't have reliable data on this yet" response,
  never a guess.

### Explicit out of scope (this milestone)

- Non-NY tickets. All three interviews conducted for this research were
  Ethiopia, New Hampshire, and New Jersey — none are NY, and the original
  D03 story about a ticket "abroad" is cut for this reason, not because the
  finding is wrong, but because it's out of the stated jurisdiction.
- Court-specific payment logistics (which office, which portal) — real
  interview evidence (self- and friend-interview) shows this is genuinely
  frustrating, but building it requires a real NY court-by-court dataset
  this research pass didn't produce. Candidate for a fast-follow, not MVP.
- Insurance premium percentage estimates. The self-interview's ~30% figure
  is one non-NY data point dependent on that subject's renewal-cycle timing
  — not a number TicketPath should generalize or display as if it were NY
  fact.
- Any "you should plead X" or "you should fight this" recommendation —
  TicketPath explains the comparison; it doesn't make the call (see §6).
- Tracking court-mandated follow-ups (e.g., a driving course) — a real loose
  end from the self-interview, but a distinct feature, not this milestone.

## 6. User stories & acceptance criteria

Source tags: **[I-Dagi]**, **[I-Self]**, **[I-Friend]** = one of the three
W03 interviews; **[A]** = assumption, explicitly unvalidated.

### Story 1 — Know the points

**As a driver who's just gotten a ticket, I want to know how many points it
carries, so I understand what a conviction would put on my record.**
*(Rewritten from D03's original "so I can ascertain how one ticket will
affect my insurance premiums" — cut per the traceability review: TicketPath
cannot calculate a premium impact, since insurers price on their own models,
not a public formula. The self-interview confirms this is genuinely
complicated even for insurers to quote — see §3.)*

Source: **[I-Dagi]** (wanted to know point/consequence severity, though from
a non-NY ticket) + **[A]** (that a NY user wants the same thing — reasonable,
unvalidated by a NY subject).

Acceptance criteria:
- Given a supported NY violation, the point value shown matches the sourced
  DMV point table, with the source link and last-verified date displayed
  next to it.
- If the violation isn't in the supported set, the product says so
  explicitly — it does not estimate or omit silently.
- The product never displays a premium-increase percentage or dollar figure.

### Story 2 — Know the cost, as a range

**As a driver deciding whether a ticket is worth fighting, I want to see a
labeled range for what it could cost — fine plus surcharge exposure — so I
can weigh that against the cost of contesting it.**
*(Rewritten from D03's "the exact amount I need to pay" — for NY moving
violations, the fine is frequently not fixed until conviction and can carry
a separate DRA; "exact" is not a promise TicketPath can keep.)*

Source: **[I-Self]** (spent months comparing a ~$250 fine + ~30% insurance
hit against a $700 legal fee — this is the single clearest piece of evidence
across all three interviews for this story) + **[I-Friend]** (fine ranges,
one charge dismissed in court) + **[I-Dagi]** (wanted a straightforward cost
answer without extra work).

Acceptance criteria:
- Given a supported violation, the product shows the fine range and DRA
  trigger condition, each labeled as a range, never a single "you owe"
  number — and each with a source and last-verified date. (E.g. for
  speeding 11–30mph over under VTL §1180, that's "$90–$300, plus imprisonment
  up to 15 days as a statutory maximum, plus a ~$93 mandatory surcharge" —
  sourced in §3, not invented.)
- If fine data isn't sourced yet for a violation (true for most of the
  target set as of this PRD — §1180 speeding is done, the rest aren't — see
  §3), the product says so rather than inventing a plausible-looking number.
- The product does not attempt to price "the cost of fighting it" (lawyer
  fees) — no data exists yet to range that responsibly (see §5, out of
  scope) — but does state, in plain language, that contesting typically
  involves a lawyer and takes weeks to months, per **[I-Self]**.

### Story 3 — A single, sourced comparison (new — not in D03)

**As a driver who doesn't want to make five phone calls to figure out
whether fighting a ticket is worth it, I want to see the pay path and the
fight path laid out side by side with what's known and what isn't, so I can
make the call myself in minutes instead of months.**

Source: **[I-Self]** — "I wish I had that guidance initially... to compare
whether I should pay the fine or just pay a lawyer." This is the closest
thing to a direct, unprompted product pitch in any of the three interviews.

Acceptance criteria:
- Given points + fine range + DRA exposure, the product displays a pay-path
  summary and a fight-path summary next to each other.
- The fight-path summary explicitly states what TicketPath does *not* know
  (typical local lawyer cost, likely outcome) rather than omitting the
  question or guessing at it.
- The product never collapses this into a single recommended action (see
  §5's legal line, and §7's legal-drift risk).

### Story 4 — Cut: ticket "abroad"

Original D03 story 4 ("As someone who received a traffic ticket abroad...").
Cut per §5 — out of the NY/USA-only scope the concept brief states. Kept
here, not deleted, so the traceability trail stays intact: this is where the
project first noticed all its interview evidence might not be NY-based,
which turned out to be true for all three.

## 7. Data & legal rules

- **Data rule:** every number the product displays states its source and a
  last-verified date. When a number isn't sourced yet, the product refuses
  rather than estimates — this applies to fines, DRA dollar amounts, and any
  insurance impact, all three "no data yet" as of this PRD.
- **Legal line:** TicketPath explains a driver's situation; it never
  recommends a course of action ("you should fight this," "plead guilty").
  Story 3 above is the sharpest test of this line — a comparison, not a
  verdict.
- **Legal-drift risk:** if the conversational layer (Claude API, per the
  concept brief's stack guess) is asked directly "what should I do," it must
  decline to recommend and restate the comparison instead. This needs an
  explicit test case before build, not just a policy statement here.

## 8. Open questions

Ranked by how much they'd change this document if answered. (1)–(4) below
are what a fresh "builder test" read of this PRD flagged as blocking or
design-critical; the first four sub-items under (1) were resolvable by
direct research and are now closed — see §3 for the sourced answers.

1. **Blocking data — now substantially closed:**
   - ~~Is the Feb 2026 overhaul real and in effect?~~ **Resolved** — primary
     DMV Commissioner memo confirms 2/16/2026 effective date. (The specific
     "11→10 point suspension threshold" number is still only
     secondary-sourced, though the look-back extension 18mo→24mo is
     primary-confirmed.)
   - Fine dollar ranges per violation: **partially resolved** — VTL §1180
     speeding is sourced end-to-end from statute text; the remaining ~14
     target violations need the same lookup, not done this pass.
   - DRA dollar amount: **resolved** — $100/yr+$25/pt over 6, $250/yr for
     alcohol/drug, both from an official DMV page.
   - Which violations are highest-volume: **resolved** — real statewide
     ranked ticket-count data now backs the MVP violation list in §5,
     replacing a guess.
2. **Zero of three interviews conducted are New York tickets** (Ethiopia,
   New Hampshire, New Jersey). The underlying job — cost/consequence
   uncertainty, workarounds that fail, a real pay-vs-fight decision — is now
   corroborated three times, independently. No NY-specific *interview*
   evidence exists (the data above is now real, but it's official-source
   data, not user evidence) — a real NY interview is still the single
   highest-value thing to add before CP-M3.
3. **Design decisions that data can't answer** — carried over from the
   builder-test read, unresolved by research and needing a call from the
   builder, not a source lookup:
   - The specific adversarial test prompts and required refusal wording for
     the "never recommends" legal line (§7) — e.g. "just tell me what to
     do," "what would you do," "is it worth it."
   - What "refuse rather than estimate" looks like in the UI specifically —
     a blocked state vs. a partial card with an explicit gap callout.
   - Whether the MVP needs two flows for the quick-resolver vs.
     deep-investigator persona split (§4), or one flow that serves both.
   - Whether a quick SU-student survey for volume/awareness stats (§3) is
     actually planned, and on what timeline — or the MVP ships without a
     quantified urgency claim at all.
   - Data liability: is TicketPath comfortable being the source of record on
     legal/financial exposure with no attorney review, given it explicitly
     steers users away from lawyers as the first call?
4. The $93 mandatory-surcharge figure (§3) traces to 2013 state-comptroller
   guidance — the oldest, least-recently-verified source in this document.
   Re-check it before build; don't ship it on today's verification date
   alone.

## 9. Sources

- [dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system](https://dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system) — point value table (common violations), verified 2026-09-27.
- [DMV Commissioner memo "P"2/"M"1 (2026), Jan 30 2026](https://www.ejustice.ny.gov/LawEnforcement/docs/dmv/P2M12026.pdf) — primary regulatory source for the 9 violations whose points changed 2/16/2026, and the 18→24 month look-back extension. Cached copy also saved to this session's tool-results for re-reference.
- [dmv.ny.gov/how-pay-driver-responsibility-assessment](https://dmv.ny.gov/how-pay-driver-responsibility-assessment) — DRA dollar amounts, verified 2026-09-27.
- [NY Senate — VAT §1180 statute text](https://www.nysenate.gov/legislation/laws/VAT/1180) — speeding fine ranges, verified 2026-09-27.
- NYS Comptroller guidance (2013) — $93 mandatory surcharge figure; **oldest source in this document, flagged for re-verification in §8.**
- [data.ny.gov — "Traffic Tickets Issued: Four Year Window" (q4hy-kbtf)](https://data.ny.gov/Transportation/Traffic-Tickets-Issued-Four-Year-Window/q4hy-kbtf) — real violation-count ranking, queried via the Socrata API, verified 2026-09-27.
- `docs/research/w03-interview-dagi.md` — Dagi, Ethiopia ticket.
- `docs/research/w03-interview-self.md` — self, New Hampshire ticket.
- `docs/research/w03-interview-friend.md` — friend, New Jersey ticket.
- `docs/01-concept-brief.md` — CP-M1.
- `docs/research/discovery-logs/d04-prd-strong.md` — Airbnb/Spotify PRD comparison informing this document's structure.
