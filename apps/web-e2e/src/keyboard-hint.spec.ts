import { expect, Page, test } from '@playwright/test';

/**
 * The shortcut hints of a selected mind map topic.
 *
 * The hints are the only place the mind map keys are documented, so the tests cover
 * both ways of switching them off: the menu switch and the close button in the hint
 * itself, plus the fact that the choice survives a reload.
 */

const keyboardHint = (page: Page) => page.locator('[data-testid="keyboard-hint"]');
const keyboardHintSwitch = (page: Page) => page.locator('[data-testid="keyboard-hint-button"]');

/** Draws a mind map on the canvas and leaves editing again. */
const createMindMap = async (page: Page) => {
  await page.locator('.draw-toolbar label[title$="— M"]').click();
  await page.mouse.move(720, 450);
  await page.mouse.click(720, 450);
  await page.keyboard.type('根');
  await page.keyboard.press('Escape');
  await expect(keyboardHint(page)).toHaveCount(1);
};

const openAppMenu = async (page: Page) => {
  await page.locator('.app-toolbar .tool-icon_type_button').first().click();
  await expect(page.locator('.menu')).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.drawnix .plait-board-container')).toBeVisible();
});

test('the hints appear for a selected topic and close in place', async ({ page }) => {
  await createMindMap(page);

  // the mind map keys and the app/canvas keys are listed as two groups
  await expect(page.locator('.keyboard-hint__group')).toHaveCount(2);
  await expect(page.locator('.keyboard-hint__key')).toHaveCount(15);

  await page.locator('[data-testid="keyboard-hint-close"]').click();
  await expect(keyboardHint(page)).toHaveCount(0);

  // the menu switch follows what is on screen
  await openAppMenu(page);
  await expect(keyboardHintSwitch(page)).toHaveAttribute('aria-checked', 'false');
});

test('the menu switch turns the hints off and the choice is remembered', async ({ page }) => {
  await createMindMap(page);

  await openAppMenu(page);
  await expect(keyboardHintSwitch(page)).toHaveAttribute('aria-checked', 'true');
  await keyboardHintSwitch(page).click();
  await expect(keyboardHint(page)).toHaveCount(0);

  await openAppMenu(page);
  await expect(keyboardHintSwitch(page)).toHaveAttribute('aria-checked', 'false');

  // the stored preference keeps them off after a reload, even with a topic selected
  await page.reload();
  await expect(page.locator('.drawnix .plait-board-container')).toBeVisible();
  await page.locator('.plait-board-container foreignObject').first().click();
  await expect(keyboardHint(page)).toHaveCount(0);
});
