'use client';

import { useRef, useState } from 'react';
import {
  ACCEPTED_MEDIA_TYPES,
  MAX_IMAGE_EDGE_PX,
  type AcceptedMediaType,
} from '@/lib/extraction/extract';
import type { Citation } from '@/lib/extraction/schema';

/**
 * Capture or choose a ticket photo, downscale it, and send it for reading.
 *
 * The photo never leaves this request chain: it goes to our route handler,
 * which forwards it to Claude and discards it (record 0002). Nothing is
 * uploaded to storage.
 */

type Props = { onExtracted: (citation: Citation) => void };

/**
 * Downscale to the vision long-edge max and re-encode as JPEG.
 * A 12MP phone photo is ~4MB; this usually lands under 500KB.
 */
async function prepareImage(
  file: File,
): Promise<{ data: string; mediaType: AcceptedMediaType; previewUrl: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE_PX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas-unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.85),
  );
  if (!blob) throw new Error('encode-failed');

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('read-failed'));
    reader.readAsDataURL(blob);
  });

  return {
    data: dataUrl.split(',')[1],
    mediaType: 'image/jpeg',
    previewUrl: URL.createObjectURL(blob),
  };
}

export default function ScanTicket({ onExtracted }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_MEDIA_TYPES.includes(file.type as AcceptedMediaType)) {
      setStatus('error');
      setError('Photos must be JPEG, PNG or WebP.');
      return;
    }

    setStatus('working');
    setError(null);

    try {
      const { data, mediaType, previewUrl } = await prepareImage(file);
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return previewUrl;
      });

      const response = await fetch('/api/tickets/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: data, mediaType }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setStatus('error');
        setError(payload.message ?? 'Something went wrong. Try again.');
        return;
      }

      setStatus('idle');
      onExtracted(payload.citation as Citation);
    } catch {
      setStatus('error');
      setError("We couldn't process that photo. Try a different one.");
    } finally {
      // Let the same file be picked again after an error.
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="scan">
      <label className="scan__label" htmlFor="ticket-photo">
        Photo of your ticket
      </label>

      <input
        ref={inputRef}
        id="ticket-photo"
        className="scan__input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        disabled={status === 'working'}
      />

      <p className="scan__hint">
        On a phone this opens the camera. Your photo is read and then discarded —
        we never store it.
      </p>

      {/* Empty state */}
      {!preview && status === 'idle' && (
        <div className="panel-note" data-state="empty">
          <p className="panel-note__title">No photo yet</p>
          <p>Take or choose a photo and we&apos;ll read the violation off it.</p>
        </div>
      )}

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element -- blob: URL, never optimised
        <img className="scan__preview" src={preview} alt="The ticket you selected" />
      )}

      {/* Loading state */}
      {status === 'working' && (
        <div className="panel-note" data-state="working" role="status" aria-live="polite">
          <p className="panel-note__title">Reading your ticket…</p>
          <p>This usually takes a few seconds.</p>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && error && (
        <div className="panel-note" data-state="error" role="alert">
          {/* Neutral heading: this covers not-a-ticket, unreadable, wrong-state
              and API failures, and the message below says which. */}
          <p className="panel-note__title">We couldn&apos;t use that photo</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
