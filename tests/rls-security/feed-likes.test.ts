import { createAnonClient, createServiceClient, createUserClient } from '@tools/supabase-test-client';
import { buildUser } from '@fixtures/index';

const SUPABASE_CONFIGURED = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const describeOrSkip = SUPABASE_CONFIGURED ? describe : describe.skip;

describeOrSkip('RLS — feed_likes', () => {
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
    const { data: post } = await admin.from('feed_posts').insert({ user_id: userAId, content: 'Post for like tests' }).select().single();
    postId = post!.id;
  });

  afterAll(async () => {
    await admin.from('feed_likes').delete().eq('post_id', postId);
    await admin.from('feed_posts').delete().eq('id', postId);
    await admin.auth.admin.deleteUser(userAId);
    await admin.auth.admin.deleteUser(userBId);
  });

  describe('SELECT: anyone can view likes', () => {
    it('anon user can read likes', async () => {
      await admin.from('feed_likes').insert({ user_id: userAId, post_id: postId });
      const { data, error } = await createAnonClient().from('feed_likes').select('id').eq('post_id', postId);
      expect(error).toBeNull();
      expect(data!.length).toBeGreaterThan(0);
      await admin.from('feed_likes').delete().eq('post_id', postId).eq('user_id', userAId);
    });
  });

  describe('INSERT: authenticated users can like (own user_id only)', () => {
    it('authenticated user can like a post', async () => {
      const client = await createUserClient(userB.email, password);
      const { error } = await client.from('feed_likes').insert({ user_id: userBId, post_id: postId });
      expect(error).toBeNull();
    });

    it('authenticated user cannot like on behalf of another user', async () => {
      const client = await createUserClient(userB.email, password);
      const { error } = await client.from('feed_likes').insert({ user_id: userAId, post_id: postId });
      expect(error).toBeTruthy();
    });

    it('anon user cannot like', async () => {
      const { error } = await createAnonClient().from('feed_likes').insert({ user_id: userAId, post_id: postId });
      expect(error).toBeTruthy();
    });
  });

  describe('DELETE: users can remove their own likes only', () => {
    it('user can remove their own like', async () => {
      const client = await createUserClient(userB.email, password);
      const { data } = await client.from('feed_likes').delete().eq('user_id', userBId).eq('post_id', postId).select();
      expect(data).toHaveLength(1);
    });
  });
});
