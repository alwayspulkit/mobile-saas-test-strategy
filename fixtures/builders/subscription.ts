import { faker } from '@faker-js/faker';

export type SubscriptionStatus = 'active' | 'expired' | 'in_trial' | 'cancelled';

export interface TestSubscription {
  user_id: string;
  product_id: string;
  status: SubscriptionStatus;
  expires_at: string;
  is_sandbox: boolean;
  original_purchase_date: string;
}

interface SubscriptionOverrides {
  user_id?: string;
  product_id?: string;
  status?: SubscriptionStatus;
  expires_at?: string;
  is_sandbox?: boolean;
  original_purchase_date?: string;
}

export function buildSubscription(overrides: SubscriptionOverrides = {}): TestSubscription {
  const expiresAt = faker.date.future();
  return {
    user_id: faker.string.uuid(),
    product_id: 'eventflow_pro_monthly',
    status: 'active',
    expires_at: expiresAt.toISOString(),
    is_sandbox: true,
    original_purchase_date: new Date().toISOString(),
    ...overrides,
  };
}

export function buildExpiredSubscription(overrides: SubscriptionOverrides = {}): TestSubscription {
  return buildSubscription({
    status: 'expired',
    expires_at: faker.date.past().toISOString(),
    ...overrides,
  });
}
