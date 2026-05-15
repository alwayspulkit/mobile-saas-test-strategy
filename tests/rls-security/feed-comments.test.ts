import { createAnonClient, createServiceClient, createUserClient } from '@tools/supabase-test-client';
import { buildUser } from '@fixtures/index';

const SUPABASE_CONFIGURED = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const describeOrSkip = SUPABASE_CONFIGURED ? describe : describe.skip;

describeOrSkip('RLS — feed_comments', () => {
  const admin = createServiceClient();
  const postOwner = buildUser();
  const commenter = buildUser();
  const otherUser = buildUser();
  const password = 'TestP@ssw0rd!';
  let postOwnerId: string;
  let commenterId: string;
  let otherUserId: string;
  let postId: string;
  let commentId: string;

  beforeAll(async () => {
    const { data: a } = await admin.auth.admin.createUser({ email: postOwner.email, password, email_confirm: true });
    const { data: b } = await admin.auth.admin.createUser({ email: commenter.email, password, email_confirm: true });
    const { data: c } = await admin.auth.admin.createUser({ email: otherUser.email, password, email_confirm: true });
    postOwnerId = a.user!.id;
    commenterId = b.user!.id;
    otherUserId = c.user!.id;
    const { data: post } = await admin.from('feed_posts').insert({ user_id: postOwnerId, content: 'Post for comment tests' }).select().single();
    postId = post!.id;
    const { data: comment } = await admin.from('feed_comments').insert({ user_id: commenterId, post_id: postId, content: 'A comment' }).select().single();
    commentId = comment!.id;
  });

  afterAll(async () => {
    await admin.from('feed_comments').delete().eq('post_id', postId);
    await admin.from('feed_posts').delete().eq('id', postId);
    await admin.auth.admin.deleteUser(postOwnerId);
    await admin.auth.admin.deleteUser(commenterId);
    await admin.auth.admin.deleteUser(otherUserId);
  });

  describe('SELECT: anyone can view comments', () => {
    it('anon user can read comments', async () => {
      const { data, error } = await createAnonClient().from('feed_comments').select('id').eq('id', commentId);
      expect(error).toBeNull();
      expect(data).toHaveLength(1);
    });
  });

  describe('INSERT: authenticated users can add comments', () => {
    it('authenticated user can comment', async () => {
      const client = await createUserClient(otherUser.email, password);
      const { data, error } = await client.from('feed_comments').insert({ user_id: otherUserId, post_id: postId, content: 'Another comment' }).select().single();
      expect(error).toBeNull();
      if (data?.id) await admin.from('feed_comments').delete().eq('id', data.id);
    });

    it('anon user cannot comment', async () => {
      const { error } = await createAnonClient().from('feed_comments').insert({ user_id: commenterId, post_id: postId, content: 'Anon comment' });
      expect(error).toBeTruthy();
    });
  });

  describe('DELETE: comment author or post owner can delete', () => {
    it('comment author can delete their own comment', async () => {
      const client = await createUserClient(commenter.email, password);
      const { data } = await client.from('feed_comments').delete().eq('id', commentId).select();
      expect(data).toHaveLength(1);
    });

    it('post owner can delete a comment on their post', async () => {
      const { data: newComment } = await admin.from('feed_comments').insert({ user_id: commenterId, post_id: postId, content: 'Comment to delete by post owner' }).select().single();
      const client = await createUserClient(postOwner.email, password);
      const { data } = await client.from('feed_comments').delete().eq('id', newComment!.id).select();
      expect(data).toHaveLength(1);
    });

    it('third party cannot delete someone else\'s comment', async () => {
      const { data: seedComment } = await admin.from('feed_comments').insert({ user_id: commenterId, post_id: postId, content: 'Protected comment' }).select().single();
      const client = await createUserClient(otherUser.email, password);
      const { data } = await client.from('feed_comments').delete().eq('id', seedComment!.id).select();
      expect(data).toHaveLength(0);
      await admin.from('feed_comments').delete().eq('id', seedComment!.id);
    });
  });
});
