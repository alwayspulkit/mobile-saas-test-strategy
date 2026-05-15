import { faker } from '@faker-js/faker';

export interface TestUser {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_pro: boolean;
  created_at: string;
}

interface UserOverrides {
  id?: string;
  email?: string;
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
  is_pro?: boolean;
  created_at?: string;
}

export function buildUser(overrides: UserOverrides = {}): TestUser {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email({ provider: 'test.eventflow.example' }),
    username: faker.internet.username().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
    display_name: faker.person.fullName(),
    avatar_url: null,
    is_pro: false,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function buildProUser(overrides: UserOverrides = {}): TestUser {
  return buildUser({ is_pro: true, ...overrides });
}
