import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { CitationSchema, type Citation } from './schema';

/**
 * Reads a New York traffic citation photo.
 *
 * The model does exactly one job: report what is printed on the paper. It
 * never supplies point values, fine ranges or any other number TicketPath
 * displays as fact — those come from the sourced tables (PRD §7, record 0002).
 */

/** Vision max is 2576px on the long edge; larger costs tokens and buys nothing. */
export const MAX_IMAGE_EDGE_PX = 2576;
export const ACCEPTED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export type AcceptedMediaType = (typeof ACCEPTED_MEDIA_TYPES)[number];

export type ExtractionFailure =
  | { ok: false; reason: 'not_a_ticket' }
  | { ok: false; reason: 'unreadable' }
  /** A real citation, but issued by another state. PRD §5: New York only. */
  | { ok: false; reason: 'wrong_state'; state: string }
  | { ok: false; reason: 'malformed_output' }
  | { ok: false; reason: 'api_failure'; status?: number };

export type ExtractionResult = { ok: true; citation: Citation } | ExtractionFailure;

const SYSTEM_PROMPT = `You read photographs of New York State traffic citations and report what is printed on them.

Rules:
- Report only what you can actually see. If a field is missing, illegible or you are guessing, return null for it and add its name to uncertain_fields. Never invent a plausible value.
- Do NOT report the driver's name, licence number, date of birth, home address, or plate number, even if they are clearly visible. They are not needed and must not leave the image.
- Do not state point values, fine ranges, penalties or legal consequences. You are not the source for those; a separate sourced database is. Report only what the paper says.
- printed_fine_amount is the payable amount printed on the ticket, if one is printed. Many NY citations print no amount, because the fine is set at conviction. Return null when none is printed.
- Set is_traffic_ticket to false for anything that is not a traffic citation, including parking tickets, event tickets, receipts and unrelated photos.
- Set is_legible to false when it is a citation but too blurry, dark or cropped to read the violation.
- issuing_state is the two-letter code of the state that issued the ticket, as printed on the form ("NY", "NH", "NJ"). Look at the form's own heading and agency, not the address of the driver. Return null if you cannot see it.`;

export async function extractCitation(
  imageBase64: string,
  mediaType: AcceptedMediaType,
): Promise<ExtractionResult> {
  // Constructed per call so a missing key fails here, on the server, and never
  // at module load (which would break unrelated routes).
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let response;
  try {
    response = await client.messages.parse({
      model: 'claude-sonnet-5-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
            { type: 'text', text: 'Read this ticket and return the fields.' },
          ],
        },
      ],
      // Structured outputs, not forced tool use: tool_choice "tool"/"any" is
      // rejected with a 400 on claude-sonnet-5-5.
      output_config: { format: zodOutputFormat(CitationSchema) },
    });
  } catch (error) {
    const status = error instanceof Anthropic.APIError ? error.status : undefined;
    console.error('[scan] Claude API call failed', { status });
    return { ok: false, reason: 'api_failure', status };
  }

  // parsed_output is null when the response didn't satisfy the schema.
  const citation = response.parsed_output;
  if (!citation) {
    console.error('[scan] response did not match schema');
    return { ok: false, reason: 'malformed_output' };
  }

  if (!citation.is_traffic_ticket) return { ok: false, reason: 'not_a_ticket' };
  if (!citation.is_legible) return { ok: false, reason: 'unreadable' };

  // Out-of-state citation: refuse rather than score it against the NY point
  // table (PRD §5). An unreadable state is NOT refused — it's surfaced in the
  // review form for the user to confirm, like any other uncertain field.
  const state = citation.issuing_state?.trim().toUpperCase();
  if (state && state !== 'NY' && state !== 'NEW YORK') {
    return { ok: false, reason: 'wrong_state', state: citation.issuing_state!.trim() };
  }
  if (!state && !citation.uncertain_fields.includes('issuing_state')) {
    citation.uncertain_fields.push('issuing_state');
  }

  // A citation we can't name the violation on is no better than an unreadable
  // one: the lookup has nothing to key on. Refuse rather than return a shell.
  if (!citation.violation_code && !citation.violation_description) {
    return { ok: false, reason: 'unreadable' };
  }

  return { ok: true, citation };
}

/** User-facing copy for each failure. Kept here so the route and UI agree. */
export function describeFailure(failure: ExtractionFailure): string {
  switch (failure.reason) {
    case 'not_a_ticket':
      return "That doesn't look like a traffic ticket. Try another photo, or enter your violation by hand.";
    case 'unreadable':
      return "We couldn't read that photo. Try again in better light with the whole ticket in frame, or enter your violation by hand.";
    case 'wrong_state':
      return `That looks like a ${failure.state} ticket. TicketPath only covers New York right now, and ${failure.state}'s points and fines work differently — we'd rather tell you that than show you the wrong numbers.`;
    case 'malformed_output':
      return 'Something went wrong reading that ticket. Try again, or enter your violation by hand.';
    case 'api_failure':
      return "We couldn't reach our reader just now. Try again in a moment, or enter your violation by hand.";
  }
}
