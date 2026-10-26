import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client for route handlers and server components.
 *
 * Reads the session from cookies so RLS sees the real auth.uid(). Never used
 * with a service-role key: route handlers act as the signed-in user, so a bug
 * in our code still can't read someone else's ticket.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a server component, where cookies are read-only.
            // Middleware refreshes the session instead, so this is safe to skip.
          }
        },
      },
    },
  );
}
