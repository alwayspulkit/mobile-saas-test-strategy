import { faker } from '@faker-js/faker';

export interface TestEvent {
  id: string;
  name: string;
  location_city: string;
  location_country: string;
  start_date: string;
  end_date: string;
  genre: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
}

interface EventOverrides {
  id?: string;
  name?: string;
  location_city?: string;
  location_country?: string;
  start_date?: string;
  end_date?: string;
  genre?: string;
  image_url?: string | null;
  is_published?: boolean;
  created_at?: string;
}

const GENRES = ['Electronic', 'House', 'Techno', 'Drum & Bass', 'Ambient', 'Disco'];
const CITIES = ['Berlin', 'Amsterdam', 'Barcelona', 'London', 'Lisbon', 'Vienna'];

export function buildEvent(overrides: EventOverrides = {}): TestEvent {
  const startDate = faker.date.future();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + faker.number.int({ min: 1, max: 3 }));

  return {
    id: faker.string.uuid(),
    name: `${faker.word.adjective()} ${faker.word.noun()} Festival`,
    location_city: faker.helpers.arrayElement(CITIES),
    location_country: faker.location.country(),
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    genre: faker.helpers.arrayElement(GENRES),
    image_url: null,
    is_published: true,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function buildUnpublishedEvent(overrides: EventOverrides = {}): TestEvent {
  return buildEvent({ is_published: false, ...overrides });
}
