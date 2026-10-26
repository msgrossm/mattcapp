# D08 — What's Hardest About CRUD?

**Name:** Matthew Grossman
**Date:** 10/26/26
**AI tool used:** Claude Code (desktop app, Opus 5.5)
**Conversation link(s):** _[paste Claude Code session link]_
**Commits:** [ffaeb81](https://github.com/msgrossm/mattcapp/commit/ffaeb81) (Lab 5 code, committed first so D08 stands alone) · [42a8d59](https://github.com/msgrossm/mattcapp/commit/42a8d59) (D08)
**Time spent:** _[fill in]_

### 1. What I did
I picked the **ticket** from TicketPath and wrote the four lines first:

```
Create — a driver adds a ticket they got: violation, date issued, court date, fine printed on it
Read   — the driver sees all their saved tickets, newest first, with points for each and the 18-month total
Update — the driver fixes a ticket they typed wrong (wrong date or wrong violation)
Delete — the driver removes a ticket they entered by mistake
```

I turned each line into a check (C1–C4), had Claude Code plan in plan mode, approved
the plan, and had it build against the checks: a `/tickets` page plus
`/api/local-tickets` routes. All four checks passed with curl and in the real page,
with a reload after each step.

**Where the data lives:** a local JSON file behind Next.js API routes, with no login.
Supabase isn't connected yet (my `.env.local` still has placeholder keys), and the
API routes are the same shape Supabase will slot into on Oct 29. The file first
went in the repo (`data/tickets.json`). That broke the page (see Read below), so it
moved to `~/.ticketpath/tickets.json`.

Then I tried to break it, using **my own real ticket** (New Hampshire, RSA 266:5
inspection violation, issued 5/31/2024, fine $74.40, no court date) as the test data.

### 2. Artifact — break-it table

| Verb | What I tried | What happened | Did I have to correct the agent? |
|---|---|---|---|
| Create | Enter my real NH ticket | **Can't.** The picker only has 8 NY violations. Left blank, it says "Pick a violation from the list." To save it at all I had to pick a NY violation it isn't ("Disobeying a traffic signal") | Yes. I told it to "use the ticket provided" instead of made-up test data |
| Create | Empty form | Blocked: "Pick a violation from the list." | No |
| Create | Issue date in 2027, fine of −$50, fine of $99,999,999, court date before issue date | **All four saved.** Nothing checks for any of them | No |
| Create | 20 adds at the same moment (two tabs / repeat submits) | **Sent 20, saved 5.** 15 tickets silently lost | No |
| Create | Click Add before the page finished loading | Page reloaded, form wiped, nothing saved, no message | No (found by accident) |
| Create | Double-click Add | Only 1 saved (button disables). Held up | No |
| Read | Open `/tickets` in the browser | **Endless reload loop.** The API worked with curl, but the page re-fetched thousands of times. Cause: the agent put the data file inside the project, and `next dev` treated each read as a code change. Fixed by moving the file outside the repo | The agent found and fixed it itself, but the agent caused it |
| Read | My 2024 ticket next to a recent one | 2024 ticket correctly marked "outside the 18-month window"; total counted only the recent one | No |
| Read | Future-dated ticket (2027) | Listed at the top, also labeled "outside the 18-month window," which is misleading | No |
| Read | Corrupt the data file | Error state shows ("Couldn't load your tickets") with Retry; saving also refuses | No |
| Read | My $74.40 fine | Shows as **"$74.4"** | No |
| Update | Clear the date, Save | Blocked: "Enter the date the ticket was issued." | No |
| Update | Fix a fine typo ($7440 → $74.40) | **Server said 200 OK but kept $7440.** No fine field in the edit form either. Only date and violation can be fixed, because that's what my line said | Yes. The agent's first run of this test was invalid (the fine was already 74.40) and it re-ran it |
| Update | Two tabs edit the same ticket | Last save silently wins; the first tab's change is lost with no warning | No |
| Update | Edit a ticket deleted in another tab | "That ticket no longer exists." | No |
| Delete | Click Delete | Gone instantly. **No confirm, no undo** | No |
| Delete | Double-click Delete (2 tickets saved) | Ticket deleted, then a red **"That ticket no longer exists"** error. It says it failed when it worked | No |
| Delete | Delete a made-up id | 404, handled | No |

**Moments I wanted login** (keep for D10):
- Two-tab tests: with no accounts, every ticket belongs to "whoever is using the app," so anyone can see or delete them.
- The 18-month point total only means something per driver; right now everyone shares one file.
- _[add your own]_

**Tokens:** Most of the usage went to debugging the Read reload loop. The browser
buffered thousands of repeated requests while we narrowed down the cause.

### 3. Claim
**Create was the hardest, because it was hard to specify.** My Create line said
"violation, date issued, court date, fine," and the build matched it. But the first
real ticket I tried (my own) couldn't be entered without lying about the
violation, because it's a New Hampshire inspection ticket and my spec only knew 8 NY
violations. My line also never said what a *valid* ticket is, so 2027 issue dates,
negative fines and court dates before the issue date all saved. The other verbs
broke on things the agent could patch (a disabled button, a refetch). Create broke on
something I hadn't decided.

_[reword in your own voice]_

### 4. Question
Should TicketPath refuse out-of-state tickets at Create (PRD §5 scopes it to NY), or
store them with a "we don't have data for this state" label? Many drivers near the
border will have one.

### 5. Reflection
_[2–3 sentences: what surprised you, what you'll specify differently next time.]_

### Key transcript moments
- **Reload loop (Read):** "The page loaded the form but no ticket list… it's stuck in a
  reload loop: thousands of GET requests…" The loop stopped only after the data file
  moved out of the project folder.
- **My correction:** I sent a photo of my real ticket and said "use the ticket
  provided," so the break-it tests switched to my real ticket instead of the agent's
  made-up data.
- **Agent caught its own bad test:** "test U-b was wrong. The fine was already 74.40
  when I 'fixed' it." On the re-run, the server returned 200 OK but kept $7440.
