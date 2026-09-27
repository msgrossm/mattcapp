# PRD kickoff prompt (for claude.ai)

Sent as the opening message of a new claude.ai conversation to start CP-M2
(`docs/02-prd.md`), so all prior research is loaded in one place. Kept here so
the prompt itself is versioned alongside the research it draws on.

---

I'm building the CP-M2 PRD for my solo capstone, TicketPath — a New York
traffic-ticket explainer. Below is everything I have so far: the concept
brief, all four Discovery assignments, and a user-stories primer. I want your
help turning this into a strong PRD, not a first draft you write solo — ask me
questions where the material runs out rather than filling gaps yourself.

## Concept brief (CP-M1)

**The pitch:** A New York traffic-ticket explainer for drivers who just got
pulled over and don't know what the ticket actually costs them, so they can
tell whether this is something to pay, fight, or hand to a lawyer.

**Who it's for:** A Syracuse undergraduate, 19–22, stopped on I-81 or Erie
Boulevard, sitting with a paper ticket they can't read, 5–15 minutes of
attention before they give up and mail the payment.

**The job:** When I get a traffic ticket in New York and can't tell how bad it
is, I want to understand the points, fines, and surcharges attached to my
specific violation, so I can decide whether to plead guilty by mail, request a
reduction, or find a lawyer.

**What people do instead today:** pay by mail without knowing it carries
points; Google the violation code and land on ad-farm ticket-defense sites;
ask a parent who may not know NY law; ask a general chatbot that answers
confidently and may be wrong about the statute; do nothing and find out at
insurance renewal.

**Biggest unknown:** whether I can source NY point schedules and Driver
Responsibility Assessment amounts accurately enough to state them to a user —
a confident interface makes the harm worse if the data's wrong. Close behind:
staying on the information side of the line, not legal advice.

**Stack guess:** Next.js on Vercel, Supabase, Claude API for the
conversational layer. Expected to change by CP-M3.

## D03 — User stories from a Round 2 interview (Dagi Melaku, traffic tickets)

1. As someone who's gotten a ticket, I want to know exactly how many points I
   get on my license, so I can ascertain how one ticket will affect my
   insurance premiums.
2. As someone who has gotten a traffic ticket, I want to know the exact amount
   I need to pay on a ticket, so I can easily decide whether fighting it off
   is worth it financially.
3. As someone who has gotten a traffic ticket, I want to know exactly where to
   pay the ticket, so I don't have to make multiple trips to resolve it.
4. As someone who received a traffic ticket abroad, I want to know if my
   ticket will affect my insurance or license at home, so I don't have to
   consult a lawyer or laws in multiple languages.

Gap I noted at the time: these came from one ~10-minute interview and skew
toward what Dagi happened to mention — I don't have enough USA-based stories
yet, and traffic ticket rules vary a lot by county/city/state.

**Known gap going into this conversation:** none of these four have
acceptance criteria yet. That's unfinished relative to the assignment itself
and needs to happen before these go into the PRD as real requirements — please
push back on any story I can't make testable.

Also note: story 4 (ticket "abroad") doesn't fit the concept brief's stated
scope (NY-specific, USA-based product) — flagging that as a likely cut rather
than asking you to reconcile it.

## D04 — What makes a PRD strong (comparing Airbnb's and Spotify's public PRDs)

- Airbnb's PRD: short, current-state → problem → opportunity framing, easy to
  digest, not deeply quantified.
- Spotify's PRD: opened with hard numbers (engagement %, CAGR, user-segment
  size) instead of an abstract "user experience" problem — I found this one
  much stronger.
- My claim from that Discovery: a PRD needs its problem backed by numbers and
  evidence to establish urgency and ROI, not just a described pain point.
- Open question I still have: what metrics can I actually use for TicketPath —
  average insurance increase after a first citation? Percentage of drivers
  who fight tickets vs. pay them? I don't have real numbers for either yet.

## D01 — Prompting lesson (less directly relevant, included for completeness)

Learned that few-shot prompting (giving examples) outperformed zero-shot for
matching a specific voice/tone. Not directly applicable to the PRD's content,
but relevant to how I should prompt through this: give you examples of what
"good" looks like rather than open-ended asks.

## D02 — Job-statement practice (GoHighLevel CRM, not the capstone)

Practice run on an existing product, not TicketPath — included only so you
have the full Discovery history; nothing here should feed the PRD.

## User stories & acceptance criteria — reference I already wrote

**Structure:** As a [specific role], I want [capability] so that [outcome
they care about]. Acceptance criteria are testable conditions — checkable by
someone who wasn't in the room, without asking me what I meant.

**Rule I'm holding myself to:** every story has to trace to something someone
actually said. An assumption is fine, but only if it's labeled as one — an
unlabeled assumption in a PRD is how you build for a user who doesn't exist.

## What I want from you

1. First, help me write acceptance criteria for the 4 D03 stories — testable,
   the way the primer above describes. Push back if a story can't be made
   testable with what I actually have.
2. Tell me, story by story, whether it's traceable to the interview evidence
   above or whether it's an assumption I need to label.
3. Then help me structure the CP-M2 PRD itself: current state → problem →
   opportunity (Airbnb) plus a quantified, evidenced problem statement
   (Spotify) — including calling out where I don't have real numbers yet
   (the D04 open question) rather than inventing plausible-sounding ones.
4. Flag anywhere my scope is inconsistent (e.g., story 4 above vs. the
   NY/USA-only concept brief) instead of quietly reconciling it for me.

I'll paste in the full CP-M1 job statement or additional interview notes if
you need more than what's above — ask rather than filling gaps yourself.
