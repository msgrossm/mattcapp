# User Stories & Acceptance Criteria — Primer

Reference notes for D03. This is the "Before you Begin" learning, written down so
it survives past the assignment — the same rules apply when these stories move
into `docs/02-prd.md`.

## What they're for

A user story names *who wants something and why*. Acceptance criteria name *how
you'd know it was delivered*. They solve two different failure modes:

- Without stories, a feature list drifts away from any actual person. You build
  "a points lookup" and nobody can say who it's for or what they do with it.
- Without acceptance criteria, "done" is a matter of opinion. The builder thinks
  it ships; the person who asked for it disagrees; neither can point at anything.

The second one is the load-bearing half for a solo project. There's no team to
argue with, so the criteria are the only thing keeping a feature honest.

## Structure

The standard shape:

> As a **[specific role]**, I want **[capability]** so that **[outcome they care about]**.

Three parts, three common mistakes:

- **Role** — must be a specific person in a specific situation. "As a user" is
  nobody. "As a driver who just got a ticket and hasn't opened it yet" is somebody.
- **Capability** — what they can do, not how it's implemented. "I want a
  dropdown" is a design decision smuggled into a requirement.
- **So that** — the *reason*, not a restatement of the capability. If you can
  delete the "so that" clause without losing information, it's circular.

Acceptance criteria are testable conditions. The test: **could someone who wasn't
in the room check this without asking me what I meant?** If not, it's not a
criterion, it's a wish.

## Good vs. bad

**Bad:** As a user, I want a print preview so that I can preview printing.
> "User" is nobody, and the "so that" restates the capability. Nothing here tells
> you what to build or when to stop.

**Good:** As a report author, I want to see where pages will break before I
print, so that I don't discover a split table after wasting 30 sheets.
> Specific role, real consequence, and the consequence implies the criteria —
> page boundaries have to be visible and accurate.

---

**Bad:** Acceptance criteria — "Print preview works well and is fast."
> Neither is checkable. Two people will disagree about "well" and never find out
> they disagreed.

**Good:**
- Preview displays page boundaries for the current paper size.
- Changing paper size or orientation updates the preview without reopening it.
- Page count in the preview matches the page count of the printed output.
- With nothing to print, the preview shows an empty state rather than a blank box.

---

**Bad:** As a driver, I want the app to be trustworthy so that I trust it.
> Circular, and "trustworthy" isn't a feature — it's a property that emerges from
> specific behaviors. Push on it until you get to those behaviors: *cites the
> statute*, *shows the date the schedule was retrieved*, *says when it doesn't know*.

## Practice: turning an obvious feature into a story

**"Skip a song"**

> As a listener on a generated playlist, I want to skip a track I don't want, so
> that a bad recommendation costs me two seconds instead of three minutes.

Acceptance criteria:
- Skip advances to the next track in under 200ms of the tap.
- The skipped track does not replay later in the same session.
- Skipping is available while the track is loading, not only while it's playing.
- Skipping the last track in a queue produces a defined end state, not silence.
- A skip is recorded as negative signal for future recommendations.

Note what happened: writing the criteria forced decisions the story didn't
contain. Does a skip affect recommendations? What's at the end of the queue?
**That's the real function of acceptance criteria — they surface the questions
the story let you skate past.**

## The rule that matters for D03

Every story traces to something a real person said. A story you can't attribute
to a quote is an assumption — which is allowed, but only if it's labeled as one.
An unlabeled assumption in a PRD is how you build for a user who doesn't exist.
