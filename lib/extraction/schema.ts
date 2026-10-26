import { z } from 'zod';

/**
 * What we read off a New York traffic citation.
 *
 * Deliberately absent: driver name, licence number, date of birth, home
 * address, plate number. None of them are needed to look up points or a fine
 * range, and decision record 0002 discards the photo precisely so this data
 * never lands at rest. Don't add them without a PRD story that needs them.
 *
 * Every field is nullable. PRD §7: when a value isn't there, say so — never
 * invent one.
 */
export const CitationSchema = z.object({
  /** False for anything that isn't a traffic citation — the not-a-ticket path. */
  is_traffic_ticket: z.boolean(),
  /** True when the image is a ticket but too blurry/cropped to read. */
  is_legible: z.boolean(),

  /**
   * Two-letter state code of the issuing state, as printed ("NY", "NH").
   * Null when it isn't visible.
   *
   * PRD §5 scopes TicketPath to New York. A citation printed by another state
   * is refused rather than scored against the NY point table — the numbers
   * would be confidently wrong, which is the exact harm the concept brief
   * warns about.
   */
  issuing_state: z.string().nullable(),

  /** VTL section as printed, e.g. "1180(b)" or "1172(a)". */
  violation_code: z.string().nullable(),
  /** Plain-English violation as printed, e.g. "SPEED IN ZONE". */
  violation_description: z.string().nullable(),

  charged_speed_mph: z.number().int().nullable(),
  speed_limit_mph: z.number().int().nullable(),

  /** ISO 8601 date, YYYY-MM-DD. */
  issue_date: z.string().nullable(),
  /** 24-hour HH:MM. */
  issue_time: z.string().nullable(),
  location: z.string().nullable(),

  officer_name: z.string().nullable(),
  agency: z.string().nullable(),

  court_name: z.string().nullable(),
  court_address: z.string().nullable(),
  /** ISO 8601 date, YYYY-MM-DD. */
  appearance_date: z.string().nullable(),

  /**
   * Amount printed on the ticket, if any. PRD Story 5: displayed labeled
   * "printed on your ticket" and kept separate from the Story 2 cost range.
   * Never summed into a total.
   */
  printed_fine_amount: z.number().nullable(),

  /** Field names the model was unsure about. Drives the review-form highlight. */
  uncertain_fields: z.array(z.string()),
  /** Free-text note about anything unclear. */
  notes: z.string().nullable(),
});

export type Citation = z.infer<typeof CitationSchema>;

/** Fields shown in the review form, in display order, with labels. */
export const CITATION_FIELDS: ReadonlyArray<{
  key: keyof Citation;
  label: string;
  type: 'text' | 'number' | 'date';
}> = [
  { key: 'issuing_state', label: 'Issuing state', type: 'text' },
  { key: 'violation_code', label: 'Violation code (VTL section)', type: 'text' },
  { key: 'violation_description', label: 'Violation', type: 'text' },
  { key: 'charged_speed_mph', label: 'Charged speed (mph)', type: 'number' },
  { key: 'speed_limit_mph', label: 'Speed limit (mph)', type: 'number' },
  { key: 'issue_date', label: 'Date issued', type: 'date' },
  { key: 'issue_time', label: 'Time issued', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'officer_name', label: 'Officer', type: 'text' },
  { key: 'agency', label: 'Agency', type: 'text' },
  { key: 'court_name', label: 'Court', type: 'text' },
  { key: 'court_address', label: 'Court address', type: 'text' },
  { key: 'appearance_date', label: 'Appearance date', type: 'date' },
  { key: 'printed_fine_amount', label: 'Amount printed on your ticket ($)', type: 'number' },
] as const;
