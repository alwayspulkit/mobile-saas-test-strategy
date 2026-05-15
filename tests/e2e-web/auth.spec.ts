import { test, expect } from '@playwright/test';

test.skip(!process.env.EVENTFLOW_WEB_URL, 'EVENTFLOW_WEB_URL not configured — skipping web E2E tests');

test.describe('Auth flows — web', () => {
  test('landing page loads without error', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveTitle(/Error|Not Found|500/);
    const hasAuthCTA = await page.locator('text=/sign in|get started|log in|welcome/i').count() > 0;
    expect(hasAuthCTA).toBe(true);
  });

  test('sign-in page is reachable', async ({ page }) => {
    await page.goto('/');
    const signInButton = page.locator('text=/sign in|log in/i').first();
    if (await signInButton.isVisible()) {
      await signInButton.click();
      await expect(page.locator('input[type="email"], input[placeholder*="email" i]')).toBeVisible({ timeout: 5000 });
    }
  });
});
