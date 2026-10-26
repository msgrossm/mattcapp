import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

/**
 * Temporary ticket store for D08 (no login, no Supabase yet).
 *
 * Tickets live in ~/.ticketpath/tickets.json, read and written by the
 * /api/local-tickets route handlers only. Column names match
 * public.tickets in supabase/migrations/0001_tickets.sql so the swap is a
 * change of storage, not of shape.
 *
 * The file is deliberately OUTSIDE the repo: with it at data/tickets.json,
 * `next dev` (Turbopack) treated every read as a source change, recompiled,
 * and reloaded /tickets in an endless loop (D08 log).
 *
 * DELETE THIS FILE on Oct 29 when Supabase is wired (Workshop 4).
 */

const DATA_FILE = path.join(os.homedir(), '.ticketpath', 'tickets.json');

export type LocalTicket = {
  id: string;
  violation_code: string;
  issue_date: string;
  /** Court date. Same name as the Supabase column. */
  appearance_date: string | null;
  printed_fine_amount: number | null;
  created_at: string;
  updated_at: string;
};

/**
 * Temporary copy of public.violations (points + source only). The migration
 * is still the source of truth; this goes when Supabase does.
 */
const DMV_POINTS_URL =
  'https://dmv.ny.gov/points-and-penalties/the-new-york-state-driver-point-system';
const VTL_1180_URL = 'https://www.nysenate.gov/legislation/laws/VAT/1180';

export const LOCAL_VIOLATIONS: Record<
  string,
  { label: string; points: number; source_url: string; verified_on: string }
> = {
  'speed-1-10': { label: 'Speeding, 1–10 mph over the limit', points: 3, source_url: VTL_1180_URL, verified_on: '2026-09-27' },
  'speed-11-20': { label: 'Speeding, 11–20 mph over the limit', points: 4, source_url: VTL_1180_URL, verified_on: '2026-09-27' },
  'speed-21-30': { label: 'Speeding, 21–30 mph over the limit', points: 6, source_url: VTL_1180_URL, verified_on: '2026-09-27' },
  'speed-31-40': { label: 'Speeding, 31–40 mph over the limit', points: 8, source_url: VTL_1180_URL, verified_on: '2026-09-27' },
  'speed-41-plus': { label: 'Speeding, more than 40 mph over', points: 11, source_url: VTL_1180_URL, verified_on: '2026-09-27' },
  'traffic-device': { label: 'Disobeying a traffic signal or device', points: 3, source_url: DMV_POINTS_URL, verified_on: '2026-09-27' },
  'stop-sign': { label: 'Failure to stop at a stop sign', points: 3, source_url: DMV_POINTS_URL, verified_on: '2026-09-27' },
  'follow-close': { label: 'Following too closely', points: 4, source_url: DMV_POINTS_URL, verified_on: '2026-09-27' },
};

export async function readTickets(): Promise<LocalTicket[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8')) as LocalTicket[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function writeTickets(tickets: LocalTicket[]): Promise<void> {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(tickets, null, 2));
}

export function newTicketId(): string {
  return randomUUID();
}

/** YYYY-MM-DD that parses to a real date. */
export function isDate(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value).getTime())
  );
}

export function isViolationCode(value: unknown): value is string {
  return typeof value === 'string' && value in LOCAL_VIOLATIONS;
}

/** Attach points and source, the way the Supabase select joins violations. */
export function withViolation(ticket: LocalTicket) {
  return { ...ticket, violations: { code: ticket.violation_code, ...LOCAL_VIOLATIONS[ticket.violation_code] } };
}
