import { buildUser, buildEvent } from '@fixtures/index';

const SUPABASE_CONFIGURED = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

// @smoke — release gate: must pass before any deployment
describe('@smoke — release gate checks', () => {
  describe('Test infrastructure health', () => {
    it('fixture builders are functional', () => {
      const user = buildUser();
      const event = buildEvent();
      expect(user.id).toBeTruthy();
      expect(user.email).toContain('@test.eventflow.example');
      expect(event.id).toBeTruthy();
      expect(event.is_published).toBe(true);
    });

    it('documents required environment variables', () => {
      const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
      const missing = requiredVars.filter(v => !process.env[v]);
      if (missing.length > 0) {
        console.warn(`⚠️  Missing env vars (integration/RLS tests will skip): ${missing.join(', ')}`);
      } else {
        console.log(`✅ All Supabase env vars configured`);
      }
      // Always passes — documents state, does not gate
      expect(true).toBe(true);
    });
  });

  const describeOrSkip = SUPABASE_CONFIGURED ? describe : describe.skip;

  describeOrSkip('Supabase connectivity', () => {
    it('anon client can connect', async () => {
      const { createAnonClient } = await import('@tools/supabase-test-client');
      const client = createAnonClient();
      const { error } = await client.from('feed_posts').select('id').limit(1);
      expect(error).toBeNull();
    });
  });
});
