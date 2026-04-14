import { createBrowserClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser client — uses @supabase/ssr's createBrowserClient so that the
 * session is stored in cookies (not localStorage). This makes the session
 * readable by Next.js middleware for server-side auth protection.
 */
export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}

/**
 * Token client for API route auth — validates a Bearer JWT directly.
 * Used by requireSupabaseUser in server-side API routes.
 */
export function createSupabaseTokenClient(accessToken?: string) {
  const headers = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers,
    },
  });
}
