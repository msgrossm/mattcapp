# TicketPath — Architecture map (CP-M3)

*First draft 2026-10-16. Explained in `docs/03-architecture.md`. Solid boxes
are in the MVP slice (PRD §6 Stories 1-3). Dashed boxes came from D06 and have
no PRD story yet. "S1 AC2" means Story 1, acceptance criterion 2.*

```
+----------------------------------+
| Phone browser                    |    serves: Stories 1-3; PRD §4 persona
| ticket questions + result card   |    is on a phone, 5-15 min attention
+----------------------------------+
                 |
                 | HTTPS  GET /api/lookup?violation=speed-11-20
                 v
+----------------------------------+
| VERCEL                           |
|  +----------------------------+  |
|  | Next.js pages              |  |    serves: Stories 1-3; empty,
|  | questions, result card,    |  |    unsupported and error states
|  | empty + error states       |  |    (CLAUDE.md convention)
|  +----------------------------+  |
|  | /api/lookup route handler  |  |    serves: §7 data rule; refuse,
|  | reads the row or refuses   |  |    never guess (S1 AC2, S2 AC2)
|  +----------------------------+  |
+----------------------------------+
                 |
                 | supabase-js, read-only key (row-level policy)
                 v
+----------------------------------+
| SUPABASE (Postgres)              |
| violations: code, points,        |    serves: S1 AC1, S2 AC1, §7:
|   fine_min, fine_max,            |    every number has a source
|   source_url, verified_on        |    and a last-verified date
| dra_rule: trigger, amounts,      |    serves: S2 AC1 (DRA trigger)
|   source_url, verified_on        |
| no insurance column at all       |    serves: S1 AC3 (never shown)
+----------------------------------+
                 ^
                 |
                 | loaded by hand
+----------------------------------+
| supabase/seed.sql (in the repo)  |    serves: §7 data rule; each number
| numbers from PRD §3 and §9       |    traces to a commit and a source
+----------------------------------+


PENDING: from D06, no PRD story yet. Each one gets a story or gets cut.

+ - - - - - - - - - - - +   + - - - - - - - - - - - +
  Claude API                  Supabase Auth
  route handler only,         guest -> account,
  key stays on server         case files
  needs: a story              D06 req 1, 3, 4, 6, 7
+ - - - - - - - - - - - +   + - - - - - - - - - - - +

+ - - - - - - - - - - - +   + - - - - - - - - - - - +
  Supabase Storage            Admin view
  ticket photos               staff sees tickets
  D06 req 2, 5                and photos
                              D06 req 8
+ - - - - - - - - - - - +   + - - - - - - - - - - - +
```

**Trace to walk (Story 1):** phone picks "speeding 11-20 over" → `GET
/api/lookup` on Vercel → route handler selects that row from `violations` →
row, no row, or error → points card with source and date, an "I don't have
reliable data on this yet" card, or the error state. Full hop list in
`docs/03-architecture.md` §5.
