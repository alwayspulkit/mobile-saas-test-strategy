import { createClient, SupabaseClient } from '@supabase/supabase-js';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Copy .env.example to .env and fill in your test Supabase project credentials.`
    );
  }
  return value;
}

export function getSupabaseUrl(): string {
  return requireEnv('SUPABASE_URL');
}

// Anon client — respects RLS, same permissions as an unauthenticated browser user
export function createAnonClient(): SupabaseClient {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'));
}

// Service-role client — bypasses RLS, for test setup/teardown only
// Never use this to assert RLS behaviour — it defeats the purpose
export function createServiceClient(): SupabaseClient {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Creates a client authenticated as a specific user (for RLS testing)
export async function createUserClient(email: string, password: string): Promise<SupabaseClient> {
  const client = createAnonClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Failed to sign in test user ${email}: ${error.message}`);
  return client;
}
