# D03 — From Notes to User Stories (process + submission requirements)

Assigned Thu Sep 10 · due Mon Sep 14, 10pm · 8 pts · ~90 min

## The question
Convert Round 2 interview notes into user stories with acceptance criteria.

## Process

**0. Raw material only.**
Round 2 notes (the interview about the `CP-M1` job statement — see
`docs/01-concept-brief.md`), and nothing else. Round 1 was practice on the D02
product and is irrelevant here. Reread the **left column** — what the subject
actually said and did — before looking at the right column of conclusions. The
conclusions are already one layer of interpretation; stories come from the quotes.
Questions that landed flat count as evidence too.

**1. Learning pass** (see `d03-user-stories-primer.md`).
Four things to get out of it: what stories and criteria are *for*; their
structure; good vs. bad with justifications; and practice converting obvious
features ("print preview", "skip a song"). Critique the model's attempt, then
write your own and have it critique yours — that exchange is what makes the
Reflection have anything in it.

**2. Write 4–6 stories** into `d03-user-stories.md`.
Fill the **quote column first, for every row, before writing any story.** If you
can't quote a line from the notes, you don't have a story — you have an
assumption. Label it as one or cut it.

Prompt shape that enforces this:

> Here are my raw interview notes from a ~10 minute interview. [paste]
> Help me turn these into 4–6 user stories with acceptance criteria.
> Hard rule: for every story you propose, quote the exact line from my notes it
> came from. If you can't quote a line, don't propose the story — instead tell me
> what you'd have needed to hear to justify it. Also flag anything in the notes
> you think I'm over-reading.

Then audit the output. Go story by story: does that quote actually say what the
story claims? **The model will invent plausible needs nobody expressed.** Catching
one and naming it in the Reflection is explicitly called out as a strong D03.

**3. Acceptance criteria for each.** Written so someone else could check them
without asking what you meant. No format has been taught yet — inventing one is
the point; Week 4 compares what everyone came up with.

**4. Record what you couldn't write.** The story you wanted and had no evidence
for. The question you should have asked and didn't. Where a question fell flat
and what that told you. Per the prompt, this gap is worth more than a sixth story.

## Deliverables

Two separate submissions — the form is easy to forget:

1. **Discovery Log → Blackboard**, with a working conversation link.
2. **Claim + Question → the Claim & Question form.**

The conversation link has to come from a **claude.ai** chat (Share → Create link).
A Claude Code session doesn't produce a shareable link. **Test the link in a
private window before submitting** — a broken link is a documented 4-point loss.

## Discovery Log format

**Header:** D03 · name · submission date · AI tool used · conversation link(s)
with a short description of each · time spent in minutes.

| Section | Length | What it has to do |
|---|---|---|
| What I did | 3–6 sentences/bullets | The actual path, including failed attempts and why you changed approach |
| Artifact | concrete | The stories + criteria. Paste the key part, link the rest if long |
| Claim | exactly 1 sentence | Something you now believe that you didn't. Specific enough to disagree with |
| Question | exactly 1 sentence | Something you genuinely couldn't resolve alone — not "how do I get better at this" |
| Reflection | 3–5 sentences | Honest. Surprises, errors, the moment it turned. Being wrong honestly earns full credit |

**Scoring:** 8 = on time + working links + all sections + substantive
artifact/claim/question + honest reflection. 4 = submitted but one criterion
missing. 0 = missed, late, or too thin. Lowest of 12 Discovery grades is dropped.

## Where this lands

These stories are the first real content of the `CP-M2` PRD (`docs/02-prd.md`),
not a warm-up for it. Per `CLAUDE.md`, requirements live in that file — these
stories are what fills it. Keep the notes; they're needed again in Week 5.
