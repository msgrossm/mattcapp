import { NextResponse } from 'next/server';
import { assessDra, withinDraWindow } from '@/lib/points';
import {
  isDate,
  isViolationCode,
  newTicketId,
  readTickets,
  withViolation,
  writeTickets,
  type LocalTicket,
} from '@/lib/local-store';

/**
 * D08 ticket CRUD against data/tickets.json. No login this week, so every
 * ticket belongs to whoever is using the app. Replaced by /api/tickets once
 * Supabase is wired (Oct 29).
 */

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ error: 'bad_request', message }, { status: 400 });
}

/** GET — all tickets, newest issue date first, with points and the DRA total. */
export async function GET() {
  let stored: LocalTicket[];
  try {
    stored = await readTickets();
  } catch (error) {
    console.error('[local-tickets] read failed', error);
    return NextResponse.json(
      { error: 'read_failed', message: "Couldn't load your tickets. Try again." },
      { status: 500 },
    );
  }

  const tickets = stored
    .map(withViolation)
    .sort(
      (a, b) =>
        b.issue_date.localeCompare(a.issue_date) || b.created_at.localeCompare(a.created_at),
    );

  const counted = withinDraWindow(tickets);
  const totalPoints = counted.reduce((sum, t) => sum + (t.violations.points ?? 0), 0);

  return NextResponse.json({
    tickets,
    dra: assessDra(totalPoints),
    countedTicketIds: counted.map((t) => t.id),
  });
}

/** POST — add a ticket. Violation and issue date are required. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest('Expected a JSON body.');
  }

  if (!isViolationCode(body.violation_code)) return badRequest('Pick a violation from the list.');
  if (!isDate(body.issue_date)) return badRequest('Enter the date the ticket was issued.');

  const appearance = body.appearance_date === '' ? null : (body.appearance_date ?? null);
  if (appearance !== null && !isDate(appearance)) return badRequest('Court date is not a valid date.');

  const fineRaw = body.printed_fine_amount;
  const fine = fineRaw === '' || fineRaw === null || fineRaw === undefined ? null : Number(fineRaw);
  if (fine !== null && Number.isNaN(fine)) return badRequest('Printed fine must be a number.');

  const now = new Date().toISOString();
  const ticket: LocalTicket = {
    id: newTicketId(),
    violation_code: body.violation_code,
    issue_date: body.issue_date,
    appearance_date: appearance,
    printed_fine_amount: fine,
    created_at: now,
    updated_at: now,
  };

  try {
    const tickets = await readTickets();
    tickets.push(ticket);
    await writeTickets(tickets);
  } catch (error) {
    console.error('[local-tickets] write failed', error);
    return NextResponse.json(
      { error: 'save_failed', message: "Couldn't save that ticket. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ticket: withViolation(ticket) }, { status: 201 });
}
