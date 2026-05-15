import { test, expect } from '@playwright/test';

test.skip(!process.env.EVENTFLOW_WEB_URL, 'EVENTFLOW_WEB_URL not configured — skipping web E2E tests');

test.describe('Browse events — web', () => {
  test('home screen renders without fatal JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForTimeout(2000);
    const fatalErrors = errors.filter(e =>
      e.includes('Cannot read') || e.includes('undefined is not')
    );
    expect(fatalErrors).toHaveLength(0);
  });
});
