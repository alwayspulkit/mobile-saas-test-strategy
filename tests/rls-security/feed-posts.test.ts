import { createAnonClient, createServiceClient, createUserClient } from '@tools/supabase-test-client';
import { buildUser } from '@fixtures/index';

const SUPABASE_CONFIGURED = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const describeOrSkip = SUPABASE_CONFIGURED ? describe : describe.skip;

describeOrSkip('RLS — feed_posts', () => {
  const admin = createServiceClient();
  const userA = buildUser();
  const userB = buildUser();
  const password = 'TestP@ssw0rd!';
  let userAId: string;
  let userBId: string;
  let postId: string;

  beforeAll(async () => {
    const { data: a } = await admin.auth.admin.createUser({ email: userA.email, password, email_confirm: true });
    const { data: b } = await admin.auth.admin.createUser({ email: userB.email, password, email_confirm: true });
    userAId = a.user!.id;
    userBId = b.user!.id;
    const { data } = await admin.from('feed_posts').insert({ user_id: userAId, content: 'Test post' }).select().single();
    postId = data!.id;
  });

  afterAll(async () => {
    if (postId) await admin.from('feed_posts').delete().eq('id', postId);
    await admin.auth.admin.deleteUser(userAId);
    await admin.auth.admin.deleteUser(userBId);
  });

  describe('SELECT: anyone can view posts', () => {
    it('anon user can read feed_posts', async () => {
      const { data, error } = await createAnonClient().from('feed_posts').select('id').eq('id', postId);
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
    });

    it('authenticated non-owner can read feed_posts', async () => {
      const client = await createUserClient(userB.email, password);
      const { data, error } = await client.from('feed_posts').select('id').eq('id', postId);
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
    });
  });

  describe('INSERT: authenticated users can create own posts', () => {
    it('authenticated user can insert with their own user_id', async () => {
      const client = await createUserClient(userA.email, password);
      const { data, error } = await client.from('feed_posts').insert({ user_id: userAId, content: 'My own post' }).select().single();
      expect(error).toBeNull();
      if (data?.id) await admin.from('feed_posts').delete().eq('id', data.id);
    });

    it('anon user cannot insert a post', async () => {
      const { error } = await createAnonClient().from('feed_posts').insert({ user_id: userAId, content: 'Anon post' });
      expect(error).toBeTruthy();
    });

    it('authenticated user cannot insert on behalf of another user', async () => {
      const client = await createUserClient(userB.email, password);
      const { error } = await client.from('feed_posts').insert({ user_id: userAId, content: 'Impersonation' });
      expect(error).toBeTruthy();
    });
  });

  describe('UPDATE: users can update their own posts only', () => {
    it('post owner can update their post', async () => {
      const client = await createUserClient(userA.email, password);
      const { error } = await client.from('feed_posts').update({ content: 'Updated' }).eq('id', postId);
      expect(error).toBeNull();
    });

    it('non-owner update silently affects 0 rows', async () => {
      const client = await createUserClient(userB.email, password);
      const { data } = await client.from('feed_posts').update({ content: 'Hijacked!' }).eq('id', postId).select();
      expect(data).toHaveLength(0);
    });
  });

  describe('DELETE: users can delete their own posts only', () => {
    it('non-owner delete silently affects 0 rows', async () => {
      const client = await createUserClient(userB.email, password);
      const { data } = await client.from('feed_posts').delete().eq('id', postId).select();
      expect(data).toHaveLength(0);
    });

    it('post owner can delete their post', async () => {
      const client = await createUserClient(userA.email, password);
      const { error } = await client.from('feed_posts').delete().eq('id', postId);
      expect(error).toBeNull();
      postId = '';
    });
  });
});
