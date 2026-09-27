# W03 Interview — Friend (traffic ticket)

Same six questions as the self-interview and Dagi interview, conducted live.

**Jurisdiction: New Jersey (Livingston), not New York** — third interview in
a row that isn't the product's actual target jurisdiction. See the note at
the bottom of this file; this is now the central open question for the PRD,
not a footnote.

| # | What he said and did | What I concluded |
|---|---|---|
| 1 | Ticketed in Livingston, NJ, first week of August, for going 40mph over the limit (cited for the full 40 over). | Direct parallel to the self-interview's "cited for the actual amount he was going" — neither subject got a reduced-charge break. |
| 2 | Officer claimed he'd been driving recklessly and evading for a mile; friend disputed he'd seen the officer before the lights came on. Officer accused him of "playing games." | Adversarial stop, not a calm paperwork exchange — the emotional starting point (anxious, arguing with an officer) matches the concept brief's "just got pulled over" framing more than either prior interview did. |
| 3 | Registration was expired; officer wrote a second ticket for that. Because the car was registered to his father, the officer put **both tickets in his father's name**, not his — an officer clerical error. | A friction point not in any prior interview: **tickets can simply be issued to the wrong person** (car-owner vs. driver mismatch). A product that assumes "the driver = the name on the ticket" would mishandle this case. Worth a note in scope/edge cases even if not built for MVP. |
| 4 | Speeding fine was roughly $300-400; the registration ticket was about $100 and was thrown out in court. | Consistent with the self-interview: fines aren't single fixed numbers even after the fact — a range, and one charge can be dismissed entirely. |
| 5 | They fought it. He couldn't appear himself since the ticket wasn't in his name; his father went to court and represented himself (no lawyer). Judge said "either you or your son has to pay it, pick one." Father ended up paying because he wasn't sure what else to do. | Note this is his own characterization, not a verified legal fact — flag rather than restate as true: "that's a violation of the court system" is the friend's opinion of the ruling, not a confirmed rule. Still useful as evidence that self-representation without guidance leads to bad outcomes even when the underlying case (wrong name on ticket) seems strong. |
| 6 | 2 points went on the father's license; premium went up, but the friend didn't know the percentage — only that it was "significant." | Third account (of three) confirming points -> premium increase happens, but none of the three has given a hard, verifiable percentage anyone would stand behind as a NY figure. |
| 7 | Most frustrating: (1) the officer making claims that weren't true, (2) the officer not verifying who was actually driving before naming the ticket, (3) the judge's "pick one" ultimatum. | All three are procedural/paperwork failures rather than not-knowing-the-law problems — a different frustration flavor than the self-interview's "I don't know if this is worth fighting," worth keeping distinct in the PRD rather than merging into one generic "frustration" bucket. |

## The finding that matters more than any single story

**Three interviews conducted for this capstone. Zero are New York tickets.**
Ethiopia (Dagi), New Hampshire (self), New Jersey (friend). The concept
brief's entire premise — NY point schedules, NY courts, NY Driver
Responsibility Assessment — has no interview evidence behind it at all right
now. What all three *do* support, independently and consistently, is the
underlying job: uncertainty about cost/consequence, workarounds that fail
(parent, officer, Google), and a real pay-vs-fight decision that took one
subject months and hundreds of dollars to work through.

That's strong evidence for *the job to be done*, in general. It's no
evidence at all for *the NY-specific facts* the product is supposed to
deliver. Those are different claims, and the PRD should not blur them.
