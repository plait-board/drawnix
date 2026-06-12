import { expect, test } from '@playwright/test';

test('loads the Drawnix board', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Drawnix/);
  await expect(page.locator('.drawnix')).toBeVisible();
  await expect(page.locator('.drawnix .plait-board-container')).toBeVisible();
});
