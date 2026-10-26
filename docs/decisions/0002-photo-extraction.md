# 0002 — Ticket photo extraction via Claude vision

*2026-10-22 · Accepted · Serves PRD Stories 5 and 6*

- **Context:** Story 5 needs the violation off a paper ticket without making
  the user decode a VTL code. Decision record 0001 already put a server-side
  home for a Claude API key in the stack, and architecture §4 listed the
  Claude API, Supabase Auth and Supabase Storage as boxes with no story.
  Stories 5 and 6 close the first two.

- **Decision:** The photo goes from a Next.js route handler to the Claude API
  (`claude-sonnet-5-5`) using structured outputs, and comes back as a draft
  the user confirms. Points and fine ranges are then read from the sourced
  `violations` table, not from the model. The image is discarded after
  extraction and never written to storage.

- **Why the model never supplies numbers:** letting Claude report a point
  value would put an unsourced number on screen, which §7 forbids. The model
  does one job — read what is printed on the paper — and the database does
  the other. The refusal path is unchanged: an unrecognised violation is
  still "I don't have reliable data on this yet."

- **Why not OCR (Tesseract):** a citation is a dense pre-printed form with
  handwritten fields. Raw OCR returns text, not labeled fields, and would
  still need a parser per court form.

- **Why not store the photo:** it carries a licence number, date of birth,
  address and signature — architecture §4 calls it the most sensitive data in
  the product. Discarding it after extraction removes the retention question
  and the breach surface entirely. Revisit only if a story needs the original
  image back, and write the retention rule into the PRD first.

- **Why no insurance estimate:** there is no public New York points-to-premium
  table, because insurers file proprietary rating models. The only figure in
  the research corpus is the W03 self-interview's ~30%, on a New Hampshire
  policy and dependent on that subject's renewal cycle — PRD §5 rules it out
  as non-generalisable. Any number TicketPath displayed would be invented, so
  there is deliberately no column for it (architecture §3) and the case file
  states it as a known unknown instead.

- **What would change my mind:** if extraction accuracy on real NY tickets is
  poor enough that users retype every field anyway, the feature is cost
  without benefit and manual entry wins. Test against real photographed
  tickets before CP-M5, not against synthetic images.
