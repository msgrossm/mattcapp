'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client, created once on first use.
 *
 * Lazy and cached on purpose:
 * - Constructing it during render would throw at build time, when the
 *   NEXT_PUBLIC_* vars aren't inlined, and break prerendering.
 * - A fresh object per render would change identity on every pass, so any
 *   useEffect listing it as a dependency would re-run forever.
 *
 * The anon key is public by design — row-level security protects the data,
 * not the secrecy of this key. See supabase/migrations/0001_tickets.sql.
 */
let client: ReturnType<typeof createBrowserClient> | undefined;

export function getSupabaseClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
