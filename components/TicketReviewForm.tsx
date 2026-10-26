'use client';

import { useMemo, useState } from 'react';
import { CITATION_FIELDS, type Citation } from '@/lib/extraction/schema';
import { VIOLATION_OPTIONS, suggestViolationCode } from '@/lib/violations';

/**
 * Review what was read before anything is saved (PRD Story 5).
 *
 * Nothing here is trusted: every field is editable, and anything the model
 * returned null for or flagged as uncertain is marked for the user to check.
 */

type Props = {
  citation: Citation;
  onConfirm: (values: Record<string, unknown>, violationCode: string | null) => void;
  saving: boolean;
  error: string | null;
};

export default function TicketReviewForm({ citation, onConfirm, saving, error }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      CITATION_FIELDS.map(({ key }) => {
        const raw = citation[key];
        return [key, raw === null || raw === undefined ? '' : String(raw)];
      }),
    ),
  );

  const suggested = useMemo(() => suggestViolationCode(citation), [citation]);
  const [violationCode, setViolationCode] = useState<string>(suggested ?? '');

  const uncertain = useMemo(
    () => new Set(citation.uncertain_fields ?? []),
    [citation.uncertain_fields],
  );

  function needsCheck(key: string): boolean {
    return uncertain.has(key) || values[key] === '';
  }

  const flaggedCount = CITATION_FIELDS.filter(({ key }) => needsCheck(key)).length;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onConfirm(values, violationCode || null);
  }

  return (
    <form className="review" onSubmit={handleSubmit}>
      <h2>Check what we read</h2>
      <p className="review__intro">
        We read this off your photo. Nothing is saved until you confirm it.
        {flaggedCount > 0 && (
          <>
            {' '}
            <strong>
              {flaggedCount} field{flaggedCount === 1 ? '' : 's'} need
              {flaggedCount === 1 ? 's' : ''} your attention.
            </strong>
          </>
        )}
      </p>

      {citation.notes && (
        <div className="panel-note" data-state="info">
          <p className="panel-note__title">Note from the reader</p>
          <p>{citation.notes}</p>
        </div>
      )}

      <div className="review__fields">
        {CITATION_FIELDS.map(({ key, label, type }) => {
          const flagged = needsCheck(key);
          const isPrintedAmount = key === 'printed_fine_amount';

          return (
            <div className="field" key={key} data-flagged={flagged || undefined}>
              <label className="field__label" htmlFor={`f-${key}`}>
                {label}
                {flagged && <span className="field__flag"> · check this</span>}
              </label>

              <input
                id={`f-${key}`}
                className="field__input"
                type={type === 'date' ? 'date' : type === 'number' ? 'number' : 'text'}
                step={isPrintedAmount ? '0.01' : undefined}
                value={values[key] ?? ''}
                placeholder={flagged ? 'Not readable — add it yourself' : undefined}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [key]: e.target.value }))
                }
              />

              {isPrintedAmount && (
                <p className="field__hint">
                  This is only the amount <strong>printed on your ticket</strong>. It
                  is not what the ticket will cost you — see the cost range and the
                  assessment below.
                </p>
              )}
            </div>
          );
        })}

        <div className="field">
          <label className="field__label" htmlFor="f-violation-code">
            Which violation is this?
          </label>
          <select
            id="f-violation-code"
            className="field__input"
            value={violationCode}
            onChange={(e) => setViolationCode(e.target.value)}
          >
            <option value="">Not one of these / not sure</option>
            {VIOLATION_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="field__hint">
            {!violationCode
              ? "Nothing selected, so we won't show points or a cost range for this ticket."
              : violationCode === suggested
                ? 'We matched your ticket to this. Change it if it looks wrong.'
                : 'You changed this from what we matched.'}
          </p>
        </div>
      </div>

      {/* Refusal state — PRD Story 1 AC2: say so, never estimate. */}
      {!violationCode && (
        <div className="panel-note" data-state="warn">
          <p className="panel-note__title">We don&apos;t have reliable data on this one yet</p>
          <p>
            You can still save the ticket to your case file, but we won&apos;t show
            points or a cost range for it until it&apos;s a violation we&apos;ve sourced.
          </p>
        </div>
      )}

      {error && (
        <div className="panel-note" data-state="error" role="alert">
          <p className="panel-note__title">Couldn&apos;t save</p>
          <p>{error}</p>
        </div>
      )}

      <button className="btn btn--dark" type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Confirm and save'}
      </button>
    </form>
  );
}
