import { NextResponse } from 'next/server';
import {
  extractCitation,
  ACCEPTED_MEDIA_TYPES,
  describeFailure,
  type AcceptedMediaType,
} from '@/lib/extraction/extract';

/**
 * POST /api/tickets/scan — read a ticket photo.
 *
 * Open to guests on purpose (PRD Story 6 AC1: scan and see points without an
 * account; an account is only needed to save). Nothing is written here — this
 * route returns a draft for the user to confirm.
 *
 * The photo is never persisted: it lives in this request and is gone when the
 * response is sent (record 0002).
 */

export const runtime = 'nodejs';

/** Decoded image ceiling. The client downscales first; this is the backstop. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Crude per-IP throttle so an open endpoint can't run up a Claude bill.
 *
 * NOT production-grade: serverless instances don't share memory, so the real
 * limit is this many requests per instance. Before deploying publicly, move
 * this to a shared store (Supabase table or Upstash) — tracked as a CP-M5 task.
 */
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[scan] ANTHROPIC_API_KEY is not set');
    return NextResponse.json(
      {
        error: 'not_configured',
        message: describeFailure({ ok: false, reason: 'api_failure' }),
      },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'rate_limited', message: 'Too many scans just now. Wait a minute and try again.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'bad_request', message: 'Expected a JSON body.' },
      { status: 400 },
    );
  }

  const { imageBase64, mediaType } = (body ?? {}) as {
    imageBase64?: unknown;
    mediaType?: unknown;
  };

  if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
    return NextResponse.json(
      { error: 'bad_request', message: 'No image was sent.' },
      { status: 400 },
    );
  }

  if (
    typeof mediaType !== 'string' ||
    !ACCEPTED_MEDIA_TYPES.includes(mediaType as AcceptedMediaType)
  ) {
    return NextResponse.json(
      { error: 'bad_request', message: 'Photos must be JPEG, PNG or WebP.' },
      { status: 400 },
    );
  }

  // base64 is ~4 chars per 3 bytes; check decoded size without decoding twice.
  const approxBytes = Math.floor((imageBase64.length * 3) / 4);
  if (approxBytes > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: 'bad_request', message: 'That photo is too large. Try again — it will be resized automatically.' },
      { status: 413 },
    );
  }

  const result = await extractCitation(imageBase64, mediaType as AcceptedMediaType);

  if (!result.ok) {
    const status =
      result.reason === 'api_failure' || result.reason === 'malformed_output' ? 502 : 422;
    return NextResponse.json(
      { error: result.reason, message: describeFailure(result) },
      { status },
    );
  }

  return NextResponse.json({ citation: result.citation });
}
