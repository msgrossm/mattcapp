'use client';

import { useCallback, useEffect, useState } from 'react';
import ScanTicket from '@/components/ScanTicket';
import TicketReviewForm from '@/components/TicketReviewForm';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Citation } from '@/lib/extraction/schema';
import type { DraAssessment } from '@/lib/points';

type CaseFile = {
  tickets: Array<{
    id: string;
    violation_description: string | null;
    issue_date: string | null;
    printed_fine_amount: number | null;
    violations: {
      label: string;
      points: number;
      fine_min: number | null;
      fine_max: number | null;
      source_url: string;
      verified_on: string;
    } | null;
  }>;
  dra: DraAssessment;
};

export default function ScanPage() {
  const [citation, setCitation] = useState<Citation | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCaseFile = useCallback(async () => {
    const response = await fetch('/api/tickets');
    if (response.ok) setCaseFile(await response.json());
  }, []);

  // The client is built here, not during render, so prerendering never touches
  // it and the effect's dependencies stay stable.
  useEffect(() => {
    void (async () => {
      const { data } = await getSupabaseClient().auth.getUser();
      if (data.user) {
        setEmail(data.user.email ?? null);
        await loadCaseFile();
      }
    })();
  }, [loadCaseFile]);

  async function handleConfirm(
    values: Record<string, unknown>,
    violationCode: string | null,
  ) {
    setSaving(true);
    setError(null);

    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, violation_code: violationCode }),
    });

    setSaving(false);

    if (response.status === 401) {
      setError('Sign in below to save this ticket to your case file.');
      return;
    }
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.message ?? "Couldn't save that ticket. Try again.");
      return;
    }

    setCitation(null);
    await loadCaseFile();
  }

  return (
    <main className="page">
      <h1 className="page__title">
        Ticket <span>FIX</span>
      </h1>

      {!citation && <ScanTicket onExtracted={setCitation} />}

      {citation && (
        <TicketReviewForm
          citation={citation}
          onConfirm={handleConfirm}
          saving={saving}
          error={error}
        />
      )}

      {!email && <SignIn />}

      {email && caseFile && <CaseFileView caseFile={caseFile} />}
    </main>
  );
}

/** Account required only to save (PRD Story 6 AC1). */
function SignIn() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const { error: signInError } = await getSupabaseClient().auth.signInWithOtp({
      email: value,
      options: { emailRedirectTo: `${window.location.origin}/scan` },
    });

    if (signInError) setError(signInError.message);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="panel-note" data-state="info">
        <p className="panel-note__title">Check your email</p>
        <p>We sent a sign-in link to {value}.</p>
      </div>
    );
  }

  return (
    <form className="signin" onSubmit={handleSubmit}>
      <h2>Save this to a case file</h2>
      <p>
        You can scan and read a ticket without an account. Saving needs one, so we
        can count your points across the last 18 months.
      </p>
      <label className="field__label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className="field__input"
        type="email"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && (
        <div className="panel-note" data-state="error" role="alert">
          <p>{error}</p>
        </div>
      )}
      <button className="btn btn--dark" type="submit">
        Email me a link
      </button>
    </form>
  );
}

function CaseFileView({ caseFile }: { caseFile: CaseFile }) {
  const { tickets, dra } = caseFile;

  if (tickets.length === 0) {
    return (
      <div className="panel-note" data-state="empty">
        <p className="panel-note__title">No saved tickets yet</p>
        <p>Scan a ticket and confirm it to start your case file.</p>
      </div>
    );
  }

  return (
    <section className="casefile">
      <h2>Your case file</h2>

      <ul className="casefile__list">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="casefile__item">
            <strong>{ticket.violations?.label ?? ticket.violation_description ?? 'Unidentified violation'}</strong>
            <span>{ticket.issue_date ?? 'date unknown'}</span>

            {ticket.violations ? (
              <p>
                {ticket.violations.points} points
                {ticket.violations.fine_min !== null && ticket.violations.fine_max !== null ? (
                  <> · fine ${ticket.violations.fine_min}–${ticket.violations.fine_max}</>
                ) : (
                  <> · fine range not sourced yet</>
                )}{' '}
                <a href={ticket.violations.source_url} target="_blank" rel="noopener noreferrer">
                  source
                </a>{' '}
                (checked {ticket.violations.verified_on})
              </p>
            ) : (
              <p>We don&apos;t have reliable data on this violation yet.</p>
            )}

            {ticket.printed_fine_amount !== null && (
              <p className="casefile__printed">
                ${ticket.printed_fine_amount} printed on your ticket
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="panel-note" data-state={dra.thresholdCrossed ? 'warn' : 'info'}>
        <p className="panel-note__title">
          {dra.totalPoints} points in the last 18 months
        </p>
        {dra.thresholdCrossed ? (
          <p>
            That crosses New York&apos;s 6-point threshold, so a Driver Responsibility
            Assessment applies: ${dra.perYear} a year for three years, ${dra.totalOwed}{' '}
            in total.{' '}
            <a href={dra.sourceUrl} target="_blank" rel="noopener noreferrer">
              Source
            </a>{' '}
            (checked {dra.verifiedOn}).
          </p>
        ) : (
          <p>
            {dra.pointsUntilThreshold} more point
            {dra.pointsUntilThreshold === 1 ? '' : 's'} within 18 months would trigger a
            Driver Responsibility Assessment.{' '}
            <a href={dra.sourceUrl} target="_blank" rel="noopener noreferrer">
              Source
            </a>{' '}
            (checked {dra.verifiedOn}).
          </p>
        )}
      </div>

      {/* PRD Story 1 AC3 — the insurance question, stated as a known unknown. */}
      <div className="panel-note" data-state="info">
        <p className="panel-note__title">What about my insurance?</p>
        <p>
          We can&apos;t tell you. Insurers price on their own rating models, which
          aren&apos;t public, so any premium figure here would be invented. Your points
          and the assessment above are the costs New York actually publishes.
        </p>
      </div>
    </section>
  );
}
