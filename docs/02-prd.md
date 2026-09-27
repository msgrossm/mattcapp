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
| NY assigns points per violation on a fixed schedule | See point table below | [dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system](https://dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system) — verified 2026-09-27 | **Have** |
| NY charges a Driver Responsibility Assessment above a point threshold | Threshold stated as "6 or more points... within 18 months," paid "over a three-year period"; no dollar figure on official page | [dmv.ny.gov/driver-license-points-and-penalties](https://dmv.ny.gov/driver-license-points-and-penalties) — verified 2026-09-27 | **Partial** — trigger known, dollar amount not found on an official page yet |
| NY's point/DRA rules changed materially in Feb 2026 | Third-party sources describe a Feb 16, 2026 overhaul (new 10pt/24mo threshold, construction-zone speeding flat at 8pts); the official page fetched today still shows old-looking 11pt/18mo and 6pt/18mo language | Third-party legal-blog search results vs. live dmv.ny.gov page, both checked 2026-09-27 | **Conflicting — unresolved.** This is exactly the "confident interface, wrong data" risk the concept brief named. Do not ship a point value without re-verifying against the primary DMV source at build time, not this research pass. |
| Fine amounts per violation (dollar ranges, not just points) | — | Not yet pulled from an official source (VTL statute / NY courts fee schedule) | **No data yet** — plan to source before MVP build, not invent a plausible-sounding range |
| A first moving-violation conviction raises insurance premiums | One data point: ~30% increase, delayed until the subject's renewal cycle, per phone calls to insurers (not an NY policy, and not a published rate table) | W03 self-interview | **Anecdotal, single subject, non-NY policy — not generalizable** |
| Volume: tickets issued per year in a Syracuse-area county | — | Not sourced (ITSMR publishes NY traffic-safety data by county; not pulled this pass) | **No data yet** |
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

- Point value lookup for the ~15 highest-volume NY moving violations
  (sourced from the official DMV point table — see §3), each violation
  showing its point value, source link, and last-verified date.
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
  number — and each with a source and last-verified date.
- If fine data isn't sourced yet for a violation (true for all of them as of
  this PRD — see §3), the product says so rather than inventing a
  plausible-looking number.
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

Ranked by how much they'd change this document if answered:

1. **Zero of three interviews conducted are New York tickets** (Ethiopia,
   New Hampshire, New Jersey). The underlying job — cost/consequence
   uncertainty, workarounds that fail, a real pay-vs-fight decision — is now
   corroborated three times, independently. No NY-specific fact in this PRD
   (fine amounts, court process, insurance framing) has interview backing.
   A real NY interview would be the single highest-value thing to add before
   CP-M3.
2. **The Feb 2026 NY point-system overhaul isn't cleanly confirmed.**
   Third-party sources describe new thresholds; the live official DMV page
   pulled today still reads with older-looking language. This needs a
   direct re-check against the primary source at build time — not resolved
   by this research pass.
3. **No fine dollar amounts are sourced yet** — only point values. This is
   the largest concrete gap between "have" and "need" in §3's evidence
   table.
4. **Insurance-impact framing is harder than "a number per violation."** The
   self-interview shows it depends on where a driver is in their own renewal
   cycle, not just the violation — worth deciding now whether TicketPath
   attempts this at all, even as a range, or states plainly it can't.
5. Volume and awareness statistics (§3) have no source. A short SU-student
   survey is the most honest way to get a Spotify-style quantified urgency
   claim, per the D04 lesson, rather than citing a borrowed national number
   that may not represent this product's actual users.

## 9. Sources

- [dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system](https://dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system) — point value table, verified 2026-09-27.
- [dmv.ny.gov/driver-license-points-and-penalties](https://dmv.ny.gov/driver-license-points-and-penalties) — DRA trigger description, verified 2026-09-27.
- `docs/research/w03-interview-dagi.md` — Dagi, Ethiopia ticket.
- `docs/research/w03-interview-self.md` — self, New Hampshire ticket.
- `docs/research/w03-interview-friend.md` — friend, New Jersey ticket.
- `docs/01-concept-brief.md` — CP-M1.
- `docs/research/discovery-logs/d04-prd-strong.md` — Airbnb/Spotify PRD comparison informing this document's structure.
