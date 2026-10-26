'use client';

import { useCallback, useEffect, useState } from 'react';
import { VIOLATION_OPTIONS } from '@/lib/violations';
import type { DraAssessment } from '@/lib/points';

/**
 * D08 — add, see, fix and remove saved tickets. No login this week; data is
 * the local JSON store behind /api/local-tickets.
 */

type Ticket = {
  id: string;
  violation_code: string;
  issue_date: string;
  appearance_date: string | null;
  printed_fine_amount: number | null;
  violations: { label: string; points: number; source_url: string; verified_on: string };
};

type Payload = { tickets: Ticket[]; dra: DraAssessment; countedTicketIds: string[] };

const EMPTY_FORM = {
  violation_code: '',
  issue_date: '',
  appearance_date: '',
  printed_fine_amount: '',
};

export default function TicketsPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ issue_date: '', violation_code: '' });
  const [rowError, setRowError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch('/api/local-tickets');
      if (!response.ok) throw new Error();
      setData(await response.json());
    } catch {
      setLoadError("Couldn't load your tickets. Try again.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setAdding(true);
    setFormError(null);

    const response = await fetch('/api/local-tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setAdding(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setFormError(payload.message ?? "Couldn't save that ticket. Try again.");
      return;
    }

    setForm(EMPTY_FORM);
    await load();
  }

  function startEdit(ticket: Ticket) {
    setRowError(null);
    setEditingId(ticket.id);
    setEdit({ issue_date: ticket.issue_date, violation_code: ticket.violation_code });
  }

  async function handleSave(id: string) {
    setRowError(null);
    const response = await fetch(`/api/local-tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setRowError(payload.message ?? "Couldn't save that change. Try again.");
      return;
    }

    setEditingId(null);
    await load();
  }

  async function handleDelete(id: string) {
    setRowError(null);
    const response = await fetch(`/api/local-tickets/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setRowError(payload.message ?? "Couldn't remove that ticket. Try again.");
      return;
    }

    await load();
  }

  return (
    <main className="page">
      <h1 className="page__title">
        Ticket <span>FIX</span>
      </h1>

      <form className="signin" onSubmit={handleAdd}>
        <h2>Add a ticket</h2>

        <div className="field">
          <label className="field__label" htmlFor="violation">Violation</label>
          <select
            id="violation"
            className="field__input"
            value={form.violation_code}
            onChange={(e) => setForm({ ...form, violation_code: e.target.value })}
          >
            <option value="">Pick one…</option>
            {VIOLATION_OPTIONS.map((v) => (
              <option key={v.code} value={v.code}>{v.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="issue">Date issued</label>
          <input
            id="issue"
            className="field__input"
            type="date"
            value={form.issue_date}
            onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="court">Court date</label>
          <input
            id="court"
            className="field__input"
            type="date"
            value={form.appearance_date}
            onChange={(e) => setForm({ ...form, appearance_date: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="fine">Fine printed on the ticket ($)</label>
          <input
            id="fine"
            className="field__input"
            type="number"
            step="0.01"
            value={form.printed_fine_amount}
            onChange={(e) => setForm({ ...form, printed_fine_amount: e.target.value })}
          />
        </div>

        {formError && (
          <div className="panel-note" data-state="error" role="alert">
            <p>{formError}</p>
          </div>
        )}

        <button className="btn btn--dark" type="submit" disabled={adding}>
          {adding ? 'Adding…' : 'Add ticket'}
        </button>
      </form>

      {loadError && (
        <div className="panel-note" data-state="error" role="alert">
          <p>{loadError}</p>
          <button className="btn" type="button" onClick={() => void load()}>Retry</button>
        </div>
      )}

      {data && data.tickets.length === 0 && (
        <div className="panel-note" data-state="empty">
          <p className="panel-note__title">No saved tickets yet</p>
          <p>Add a ticket above to start your case file.</p>
        </div>
      )}

      {data && data.tickets.length > 0 && (
        <section className="casefile">
          <h2>Your tickets</h2>

          {rowError && (
            <div className="panel-note" data-state="error" role="alert">
              <p>{rowError}</p>
            </div>
          )}

          <ul className="casefile__list">
            {data.tickets.map((ticket) => (
              <li key={ticket.id} className="casefile__item">
                {editingId === ticket.id ? (
                  <>
                    <select
                      className="field__input"
                      aria-label="Violation"
                      value={edit.violation_code}
                      onChange={(e) => setEdit({ ...edit, violation_code: e.target.value })}
                    >
                      {VIOLATION_OPTIONS.map((v) => (
                        <option key={v.code} value={v.code}>{v.label}</option>
                      ))}
                    </select>
                    <input
                      className="field__input"
                      aria-label="Date issued"
                      type="date"
                      value={edit.issue_date}
                      onChange={(e) => setEdit({ ...edit, issue_date: e.target.value })}
                    />
                    <p>
                      <button className="btn btn--dark" type="button" onClick={() => void handleSave(ticket.id)}>
                        Save
                      </button>{' '}
                      <button className="btn" type="button" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <strong>{ticket.violations.label}</strong>
                    <span>Issued {ticket.issue_date}</span>
                    <p>
                      {ticket.violations.points} points{' '}
                      <a href={ticket.violations.source_url} target="_blank" rel="noopener noreferrer">
                        source
                      </a>{' '}
                      (checked {ticket.violations.verified_on})
                      {!data.countedTicketIds.includes(ticket.id) && ' · outside the 18-month window'}
                    </p>
                    {ticket.appearance_date && <p>Court date {ticket.appearance_date}</p>}
                    {ticket.printed_fine_amount !== null && (
                      <p className="casefile__printed">
                        ${ticket.printed_fine_amount} printed on your ticket
                      </p>
                    )}
                    <p>
                      <button className="btn" type="button" onClick={() => startEdit(ticket)}>
                        Edit
                      </button>{' '}
                      <button className="btn" type="button" onClick={() => void handleDelete(ticket.id)}>
                        Delete
                      </button>
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className="panel-note" data-state={data.dra.thresholdCrossed ? 'warn' : 'info'}>
            <p className="panel-note__title">
              {data.dra.totalPoints} points in the last 18 months
            </p>
            {data.dra.thresholdCrossed ? (
              <p>
                That crosses New York&apos;s 6-point threshold: ${data.dra.perYear} a year for
                three years, ${data.dra.totalOwed} in total.
              </p>
            ) : (
              <p>
                {data.dra.pointsUntilThreshold} more point
                {data.dra.pointsUntilThreshold === 1 ? '' : 's'} would trigger a Driver
                Responsibility Assessment.
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
