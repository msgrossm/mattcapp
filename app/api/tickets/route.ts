import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assessDra, withinDraWindow } from '@/lib/points';

/**
 * Saved tickets (PRD Story 6). Unlike /api/tickets/scan, these require an
 * account — saving is the one thing a guest can't do.
 *
 * RLS is the real boundary: these handlers act as the signed-in user, so even
 * a bug here can't reach another user's rows.
 */

export const runtime = 'nodejs';

/** Columns a client is allowed to write. Anything else is ignored. */
const WRITABLE = [
  'issuing_state',
  'violation_code',
  'violation_description',
  'charged_speed_mph',
  'speed_limit_mph',
  'issue_date',
  'issue_time',
  'location',
  'officer_name',
  'agency',
  'court_name',
  'court_address',
  'appearance_date',
  'printed_fine_amount',
  'notes',
] as const;

function unauthorized() {
  return NextResponse.json(
    { error: 'unauthorized', message: 'Sign in to save this ticket.' },
    { status: 401 },
  );
}

/** GET — the user's tickets, with points and the DRA assessment. */
export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return unauthorized();

  const { data, error } = await supabase
    .from('tickets')
    .select('*, violations ( code, label, points, fine_min, fine_max, source_url, verified_on )')
    .order('issue_date', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('[tickets] select failed', error.message);
    return NextResponse.json(
      { error: 'read_failed', message: "Couldn't load your tickets. Try again." },
      { status: 502 },
    );
  }

  const tickets = data ?? [];

  // Only tickets inside the 18-month window count toward the assessment, and
  // only ones whose violation resolved to a sourced point value.
  const counted = withinDraWindow(tickets);
  const totalPoints = counted.reduce(
    (sum, t) => sum + (t.violations?.points ?? 0),
    0,
  );

  return NextResponse.json({
    tickets,
    dra: assessDra(totalPoints),
    countedTicketIds: counted.map((t) => t.id),
  });
}

/** POST — save a confirmed ticket. Nothing reaches here unconfirmed. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: 'bad_request', message: 'Expected a JSON body.' },
      { status: 400 },
    );
  }

  const row: Record<string, unknown> = { user_id: auth.user.id };
  for (const key of WRITABLE) {
    const value = body[key];
    row[key] = value === undefined || value === '' ? null : value;
  }

  const { data, error } = await supabase
    .from('tickets')
    .insert(row)
    .select('*, violations ( code, label, points, fine_min, fine_max, source_url, verified_on )')
    .single();

  if (error) {
    console.error('[tickets] insert failed', error.message);
    return NextResponse.json(
      { error: 'save_failed', message: "Couldn't save that ticket. Try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ticket: data }, { status: 201 });
}
