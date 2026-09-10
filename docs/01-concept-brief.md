# Concept Brief

**Working name.** TicketPath

## The pitch, in one sentence

A New York traffic-ticket explainer for drivers who just got pulled over and
don't know what the ticket actually costs them, so they can tell whether this
is something to pay, fight, or hand to a lawyer.

## Who it's for — specifically

A Syracuse undergraduate, 19 to 22, who got stopped on I-81 or Erie Boulevard
and is sitting in their car or their dorm room with a paper ticket they can't
read. They are on their phone. They are anxious, they have never dealt with
this before, and their first instinct is to text a parent or Google the
violation code and get nothing useful back. They have somewhere between five
and fifteen minutes of attention before they give up and just mail in the
payment.

I am partly in this audience myself, and so is most of my campus.

## The job it does

When I get a traffic ticket in New York and can't tell how bad it is, I want to
understand the points, fines, and surcharges attached to my specific violation,
so I can decide whether to plead guilty by mail, request a reduction, or find a
lawyer.

## What people do instead today

- Pay it by mail without knowing it carries points.
- Google the violation code and land on ad-farm pages run by ticket-defense
  firms, which are marketing, not information.
- Ask a parent, who may not know New York law.
- Ask a general-purpose chatbot, which will answer confidently and may be wrong
  about the specific statute.
- Nothing, and find out at insurance renewal.

## Your biggest unknown

Whether I can source New York point schedules and Driver Responsibility
Assessment amounts accurately enough to state them to a user. If the underlying
data is wrong, a confident interface makes the harm worse, not better. Close
behind: whether an AI answering legal-adjacent questions can stay clearly on
the information side of the line without drifting into advice.

## Stack guess

Next.js on Vercel, Supabase for data, Claude API for the conversational layer.
Expecting this to change by CP-M3.
