# 0001 — Stack: Next.js on Vercel + Supabase + Claude API

*2026-10-16 · Accepted · From D06*

- **Context:** TicketPath needs phone-first screens, a sourced violation table it can refuse from, and a server-side place for a Claude API key, all built solo in about five weeks. If the D06 case-file flow gets a PRD story, it also needs guest-to-account case files with private photos.
- **Decision:** Next.js on Vercel for screens and route handlers, Supabase (Postgres) for data (plus auth and photo storage if those boxes survive), and the Claude API called only from route handlers.
- **Why not Firebase:** Photo storage needs the Blaze plan with a card on file and no hard spending cap. Its access rules live in a Firebase-only file, so leaving means converting NoSQL documents and rewriting every rule. Supabase's policies live in Postgres and leave with the data.
- **What would change my mind:** I picked this because TicketPath is a website, not a native app. If it has to become a native mobile app, I'd revisit Next.js for the front end. Supabase would likely stay, since it also works with Flutter.
