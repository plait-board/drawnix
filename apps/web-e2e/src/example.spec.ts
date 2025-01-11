import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.title()).toContain('Drawnix - 开源白板工具');
  expect(await page.locator('drawnix')).toBeTruthy();
});
