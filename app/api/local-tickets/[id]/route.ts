import { NextResponse } from 'next/server';
import {
  isDate,
  isViolationCode,
  readTickets,
  withViolation,
  writeTickets,
} from '@/lib/local-store';

export const runtime = 'nodejs';

type Context = { params: Promise<{ id: string }> };

function notFound() {
  return NextResponse.json(
    { error: 'not_found', message: 'That ticket no longer exists.' },
    { status: 404 },
  );
}

function badRequest(message: string) {
  return NextResponse.json({ error: 'bad_request', message }, { status: 400 });
}

/** PATCH — fix a ticket typed wrong: its issue date and/or its violation. */
export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return badRequest('Expected a JSON body.');
  }

  if (body.issue_date !== undefined && !isDate(body.issue_date)) {
    return badRequest('Enter the date the ticket was issued.');
  }
  if (body.violation_code !== undefined && !isViolationCode(body.violation_code)) {
    return badRequest('Pick a violation from the list.');
  }

  const tickets = await readTickets();
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return notFound();

  if (body.issue_date !== undefined) ticket.issue_date = body.issue_date as string;
  if (body.violation_code !== undefined) ticket.violation_code = body.violation_code as string;
  ticket.updated_at = new Date().toISOString();

  await writeTickets(tickets);
  return NextResponse.json({ ticket: withViolation(ticket) });
}

/** DELETE — remove a ticket entered by mistake. */
export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;

  const tickets = await readTickets();
  const remaining = tickets.filter((t) => t.id !== id);
  if (remaining.length === tickets.length) return notFound();

  await writeTickets(remaining);
  return new NextResponse(null, { status: 204 });
}
