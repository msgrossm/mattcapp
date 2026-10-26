import type { Citation } from './extraction/schema';

/**
 * Codes and labels for the violation picker.
 *
 * Mirrors supabase/migrations/0001_tickets.sql, which is the source of truth.
 * Only code and label live here — point values and fine ranges are ALWAYS read
 * from the database at save and read time, so a stale label is cosmetic and a
 * stale number is impossible (PRD §7).
 */
export const VIOLATION_OPTIONS = [
  { code: 'speed-1-10', label: 'Speeding, 1–10 mph over the limit' },
  { code: 'speed-11-20', label: 'Speeding, 11–20 mph over the limit' },
  { code: 'speed-21-30', label: 'Speeding, 21–30 mph over the limit' },
  { code: 'speed-31-40', label: 'Speeding, 31–40 mph over the limit' },
  { code: 'speed-41-plus', label: 'Speeding, more than 40 mph over' },
  { code: 'traffic-device', label: 'Disobeying a traffic signal or device' },
  { code: 'stop-sign', label: 'Failure to stop at a stop sign' },
  { code: 'follow-close', label: 'Following too closely' },
] as const;

/**
 * Best guess at which supported violation a citation describes.
 *
 * Returns null when nothing matches — the caller must then show the refusal
 * state ("we don't have reliable data on this yet"), never a nearest guess
 * (PRD Story 1 AC2).
 */
export function suggestViolationCode(citation: Citation): string | null {
  const { charged_speed_mph: charged, speed_limit_mph: limit } = citation;

  if (charged !== null && limit !== null) {
    const over = charged - limit;
    if (over > 0) {
      if (over <= 10) return 'speed-1-10';
      if (over <= 20) return 'speed-11-20';
      if (over <= 30) return 'speed-21-30';
      if (over <= 40) return 'speed-31-40';
      return 'speed-41-plus';
    }
  }

  const text = `${citation.violation_code ?? ''} ${citation.violation_description ?? ''}`
    .toLowerCase();

  if (text.includes('stop sign')) return 'stop-sign';
  if (/signal|traffic.control|device|red light/.test(text)) return 'traffic-device';
  if (text.includes('follow')) return 'follow-close';

  // Speeding we can't bracket, because the speeds weren't readable.
  if (/speed|1180/.test(text)) return null;

  return null;
}
