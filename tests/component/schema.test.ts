import { buildUser, buildEvent, buildSubscription } from '@fixtures/index';
import type { TestUser, TestEvent, TestSubscription } from '@fixtures/index';

describe('Schema contracts', () => {
  describe('User shape', () => {
    it('has all required fields for Supabase auth profile', () => {
      const user: TestUser = buildUser();

      const _id: string = user.id;
      const _email: string = user.email;
      const _createdAt: string = user.created_at;
      const _username: string = user.username;
      const _displayName: string = user.display_name;
      const _isPro: boolean = user.is_pro;
      const _avatarUrl: string | null = user.avatar_url;

      expect(typeof _id).toBe('string');
      expect(typeof _email).toBe('string');
      expect(typeof _isPro).toBe('boolean');
      expect(typeof _createdAt).toBe('string');
      expect(typeof _username).toBe('string');
      expect(typeof _displayName).toBe('string');
      expect(_avatarUrl === null || typeof _avatarUrl === 'string').toBe(true);
    });
  });

  describe('Event shape', () => {
    it('has all required fields for event listing', () => {
      const event: TestEvent = buildEvent();

      const _id: string = event.id;
      const _name: string = event.name;
      const _city: string = event.location_city;
      const _country: string = event.location_country;
      const _startDate: string = event.start_date;
      const _endDate: string = event.end_date;
      const _genre: string = event.genre;
      const _isPublished: boolean = event.is_published;

      expect(typeof _id).toBe('string');
      expect(typeof _name).toBe('string');
      expect(typeof _isPublished).toBe('boolean');
      expect(typeof _city).toBe('string');
      expect(typeof _country).toBe('string');
      expect(typeof _genre).toBe('string');
      expect(new Date(_startDate)).toBeInstanceOf(Date);
      expect(new Date(_endDate)).toBeInstanceOf(Date);
    });
  });

  describe('Subscription shape', () => {
    it('has all required fields for RevenueCat integration', () => {
      const sub: TestSubscription = buildSubscription();

      const _userId: string = sub.user_id;
      const _productId: string = sub.product_id;
      const _status: string = sub.status;
      const _expiresAt: string = sub.expires_at;
      const _isSandbox: boolean = sub.is_sandbox;

      expect(typeof _userId).toBe('string');
      expect(typeof _productId).toBe('string');
      expect(typeof _isSandbox).toBe('boolean');
      expect(typeof _expiresAt).toBe('string');
      expect(['active', 'expired', 'in_trial', 'cancelled']).toContain(_status);
    });

    it('status is a valid enum value', () => {
      const validStatuses = ['active', 'expired', 'in_trial', 'cancelled'];
      expect(validStatuses).toContain(buildSubscription().status);
    });
  });
});
