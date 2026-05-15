import { createAnonClient, createServiceClient } from '@tools/supabase-test-client';
import { buildUser } from '@fixtures/index';

const SUPABASE_CONFIGURED = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
const describeOrSkip = SUPABASE_CONFIGURED ? describe : describe.skip;

describeOrSkip('Auth integration — sign-up / sign-in / sign-out', () => {
  const testUser = buildUser();
  const testPassword = 'TestP@ssw0rd!99';
  let createdUserId: string | null = null;

  afterAll(async () => {
    if (createdUserId) {
      const admin = createServiceClient();
      await admin.auth.admin.deleteUser(createdUserId);
    }
  });

  it('signs up a new user', async () => {
    const client = createAnonClient();
    const { data, error } = await client.auth.signUp({
      email: testUser.email,
      password: testPassword,
    });
    expect(error).toBeNull();
    expect(data.user).toBeTruthy();
    expect(data.user?.email).toBe(testUser.email);
    createdUserId = data.user?.id ?? null;
  });

  it('signs in with valid credentials', async () => {
    const client = createAnonClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: testUser.email,
      password: testPassword,
    });
    expect(error).toBeNull();
    expect(data.session?.access_token).toBeTruthy();
  });

  it('rejects invalid credentials', async () => {
    const client = createAnonClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: testUser.email,
      password: 'wrong-password',
    });
    expect(error).toBeTruthy();
    expect(data.session).toBeNull();
  });

  it('signs out and clears session', async () => {
    const client = createAnonClient();
    await client.auth.signInWithPassword({ email: testUser.email, password: testPassword });
    const { error } = await client.auth.signOut();
    expect(error).toBeNull();
    const { data } = await client.auth.getSession();
    expect(data.session).toBeNull();
  });
});
