import { buildUser, buildProUser, buildEvent, buildUnpublishedEvent, buildSubscription, buildExpiredSubscription } from '@fixtures/index';

describe('UserBuilder', () => {
  it('generates a valid user object', () => {
    const user = buildUser();
    expect(user.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(user.email).toContain('@test.eventflow.example');
    expect(user.is_pro).toBe(false);
    expect(user.created_at).toBeTruthy();
  });

  it('generates unique ids on each call', () => {
    const ids = new Set(Array.from({ length: 20 }, () => buildUser().id));
    expect(ids.size).toBe(20);
  });

  it('applies overrides correctly', () => {
    const user = buildUser({ is_pro: true, display_name: 'Test User' });
    expect(user.is_pro).toBe(true);
    expect(user.display_name).toBe('Test User');
  });

  it('buildProUser sets is_pro to true', () => {
    expect(buildProUser().is_pro).toBe(true);
  });
});

describe('EventBuilder', () => {
  it('generates a valid event object', () => {
    const event = buildEvent();
    expect(event.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(event.name).toBeTruthy();
    expect(event.is_published).toBe(true);
    expect(new Date(event.start_date) < new Date(event.end_date)).toBe(true);
  });

  it('buildUnpublishedEvent sets is_published to false', () => {
    expect(buildUnpublishedEvent().is_published).toBe(false);
  });

  it('applies overrides correctly', () => {
    const event = buildEvent({ location_city: 'Berlin', genre: 'Techno' });
    expect(event.location_city).toBe('Berlin');
    expect(event.genre).toBe('Techno');
  });
});

describe('SubscriptionBuilder', () => {
  it('generates a valid active subscription', () => {
    const sub = buildSubscription({ user_id: 'user-123' });
    expect(sub.status).toBe('active');
    expect(sub.is_sandbox).toBe(true);
    expect(sub.user_id).toBe('user-123');
    expect(new Date(sub.expires_at) > new Date()).toBe(true);
  });

  it('buildExpiredSubscription has past expires_at', () => {
    const sub = buildExpiredSubscription();
    expect(sub.status).toBe('expired');
    expect(new Date(sub.expires_at) < new Date()).toBe(true);
  });
});
