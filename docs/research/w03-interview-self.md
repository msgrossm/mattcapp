# W03 Interview — Self (Matt, traffic ticket)

Conducted live via Claude Code, same six questions as the Dagi interview, so
the two are directly comparable. Answered in first person; transcribed here
in the same two-column format as the other W03 notes for consistency.

**Jurisdiction: New Hampshire, not New York** — same caveat as the Dagi
interview (Ethiopia). Neither interview is evidenced in the product's actual
target jurisdiction. This one maps far more closely to the concept brief's
core job (US points system, pay-vs-fight, insurance/lawyer decision) than
Dagi's did, so it's stronger *qualitative* evidence for the job-to-be-done —
but none of its numbers (point values, fine amounts, insurance %, age rules)
should be treated as NY facts.

| # | What he said and did | What I concluded |
|---|---|---|
| 1 | Ticketed in NH, March 2025, 11:30pm, for going 20mph over the limit on a route he drove every day (was going faster; officer only cited 20 over). 19 years old at the time. | Age matters beyond points/fines — in NH a 19-year-old with this ticket faces a license suspension NY may or may not mirror. Worth checking whether NY has an equivalent age-linked consequence rather than assuming it doesn't. |
| 2 | First move was telling his dad. Dad's response: "you're going to have to figure it out yourself." | The "ask a parent" workaround the concept brief already lists produced nothing — even a parent motivated to help had no actual answer. |
| 3 | Ticket itself didn't show point value. Asked the officer whether the ticket would affect his insurance — officer said "not his job... he has absolutely no clue about any of that." Then Googled and got no official/good answers. | A workaround missing from the concept brief's "what people do today" list: **asking the officer** — and the officer explicitly disclaims knowing the answer. Worth adding to that section. Confirms "Google it" is also a dead end, matching the brief's ad-farm concern. |
| 4 | Called multiple insurance companies directly with a hypothetical describing his situation. Got told roughly a 30% rate increase, but only starting after about a year, because his insurance renewal cycle had already started in February. | Real number, real complexity: the insurance impact isn't a flat percentage — it depends on where you are in your own renewal cycle. That's a genuinely hard data problem, not just a missing lookup table. Strengthens rather than resolves the concept brief's "biggest unknown." |
| 5 | Dad was set on not paying the ticket, to keep it off the insurance record. Got quotes from several lawyers over the next few months, eventually paid $700 to fight a ticket that would otherwise have cost roughly $250, to avoid the ~30% insurance increase and the license suspension. | This is the core job in action: comparing (fine + insurance hit + license loss) against (lawyer cost), and it took him months and multiple phone calls to even gather the numbers to compare. This is exactly the decision TicketPath is meant to shortcut. |
| 6 | "The most confusing part was trying to figure out whether or not it would be worth it to just pay off the ticket or to continue fighting it." Took a lot of time, effort, and bandwidth talking to lawyers. At several points felt it would've been easier to just pay and accept the consequences since he wasn't driving at the time anyway. Said: "I wish I had that guidance initially... to compare the prices on whether or not I should pay the fine or just pay a lawyer." | This is close to a direct product pitch in his own words — he's describing the exact comparison tool the concept brief proposes, unprompted. |
| 7 | Ended up fighting it; lawyer got the case dismissed. Was assigned a driving course, started it, never finished, never heard anything further about it. Hasn't been pulled over since; no further notices from NH courts. | A loose thread (unfinished, unmonitored court requirement) that's a real risk in this domain but likely outside MVP scope — flagging as a future idea, not a requirement. |

## New stories this supports (beyond the 4 in D03)

- **Direct, strong support** for a pay-vs-fight cost comparison story — now
  corroborated by two independent people (Dagi's "I just wanted this
  resolved fast" and this account's "I wish I'd had that guidance initially
  to compare paying the fine vs. paying a lawyer"), even though neither is
  a NY ticket.
- Adds a workaround to the concept brief's list: **asking the officer**,
  which the officer here explicitly refused/couldn't answer.
- Surfaces a real, hard sub-problem for the "biggest unknown": insurance
  impact isn't just violation-dependent, it's *timing*-dependent (where you
  are in your renewal cycle). Worth being honest that TicketPath likely
  can't resolve this to a single number even with good NY data.
