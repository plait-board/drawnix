import { expect, Page, test } from '@playwright/test';

/**
 * Keyboard behaviour of mind map topics.
 *
 * Plait only dispatches board key events when no text edit is in progress, and every
 * topic creation flow ends in editing mode. These tests pin down the restored
 * behaviour: Tab still drives the map while a topic is being edited, the arrow keys
 * move the caret there and only navigate the map once editing has been left, and the
 * arrow that points at the parent must reach it in every layout.
 */

type BoardContent = {
  children?: Array<{
    layout?: string;
    data?: { topic?: { children?: Array<{ text?: string }> } };
    children?: BoardContent['children'];
  }>;
  viewport?: { zoom?: number; origination?: number[] };
};

const readBoardContent = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<BoardContent | null>((resolve) => {
        const request = indexedDB.open('Drawnix');
        request.onerror = () => resolve(null);
        request.onsuccess = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('drawnix_store')) {
            db.close();
            resolve(null);
            return;
          }
          const transaction = db.transaction('drawnix_store', 'readonly');
          const get = transaction.objectStore('drawnix_store').get('main_board_content');
          get.onsuccess = () => {
            db.close();
            resolve((get.result as BoardContent) ?? null);
          };
        };
      })
  );

/** Nested topic texts as indented lines, e.g. ['根', '  子', '    (empty)']. */
const readTopicShape = async (page: Page): Promise<string[]> => {
  const content = await readBoardContent(page);
  const lines: string[] = [];
  const walk = (node: NonNullable<BoardContent['children']>[number], depth: number) => {
    const text = node?.data?.topic?.children?.[0]?.text ?? '';
    lines.push(`${'  '.repeat(depth)}${text === '' ? '(empty)' : text}`);
    (node.children ?? []).forEach((child) => walk(child, depth + 1));
  };
  (content?.children ?? []).forEach((node) => walk(node, 0));
  return lines;
};

const isTextEditing = (page: Page) =>
  page.evaluate(() => {
    const active = document.activeElement;
    return (
      !!active &&
      (active.classList.contains('slate-editable-container') ||
        !!active.closest('.slate-editable-container'))
    );
  });

const renderedTopics = (page: Page) =>
  page.locator('.plait-board-container foreignObject').allTextContents();

/**
 * Draws a mind map on the canvas and waits until its topic is ready for typing.
 * The toolbar label is picked by its hotkey suffix so the test is locale agnostic.
 */
const createMindMap = async (page: Page) => {
  await page.locator('.draw-toolbar label[title$="— M"]').click();
  await page.mouse.move(720, 450);
  await page.mouse.click(720, 450);
  await expect.poll(() => isTextEditing(page)).toBe(true);
};

/** Inserts a child topic and waits for it to become editable, like a user would. */
const insertChildTopic = async (page: Page, text: string) => {
  await page.keyboard.press('Tab');
  await expect.poll(() => isTextEditing(page)).toBe(true);
  await page.keyboard.type(text);
};

/** Inserts a topic with `key` and leaves editing again. */
const addTopic = async (page: Page, key: string, text: string) => {
  await page.keyboard.press(key);
  await expect.poll(() => isTextEditing(page)).toBe(true);
  await page.keyboard.type(text);
  await page.keyboard.press('Escape');
  await expect.poll(() => isTextEditing(page)).toBe(false);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.drawnix .plait-board-container')).toBeVisible();
});

test('typing right after creating a mind map replaces the default topic name', async ({ page }) => {
  await createMindMap(page);

  await expect.poll(() => renderedTopics(page)).toContain('中心主题');

  await page.keyboard.type('项目计划');

  await expect.poll(() => readTopicShape(page)).toEqual(['项目计划']);
});

test('Tab while editing a topic inserts a child topic', async ({ page }) => {
  await createMindMap(page);
  await page.keyboard.type('根');
  await expect.poll(() => readTopicShape(page)).toEqual(['根']);

  await insertChildTopic(page, '子');

  await expect.poll(() => readTopicShape(page)).toEqual(['根', '  子']);
});

test('arrow keys while editing move the caret and keep the topic focused', async ({ page }) => {
  await createMindMap(page);
  await page.keyboard.type('根');
  await insertChildTopic(page, '子');
  await expect.poll(() => readTopicShape(page)).toEqual(['根', '  子']);

  // a second Tab while still editing must insert a grandchild, not just leave editing
  await insertChildTopic(page, '孙');
  await expect.poll(() => readTopicShape(page)).toEqual(['根', '  子', '    孙']);

  // ArrowLeft stays in the topic: editing goes on, so no other topic is selected
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => isTextEditing(page)).toBe(true);

  // the focus is still on 孙, so Tab inserts a child of 孙 instead of a sibling
  await page.keyboard.press('Tab');
  await expect.poll(() => readTopicShape(page)).toEqual(['根', '  子', '    孙', '      (empty)']);
});

test('a printable key on a selected topic is not dropped', async ({ page }) => {
  await createMindMap(page);
  await page.keyboard.type('根');
  await page.keyboard.press('Escape');
  await expect.poll(() => isTextEditing(page)).toBe(false);

  // a real single-key press, so the key event path is exercised
  await page.keyboard.press('X');

  await expect.poll(async () => (await readTopicShape(page))[0]).toContain('X');
});

/** Screen position of a topic's text, so a test can click it and read its side. */
const topicPosition = (page: Page, text: string) =>
  page.evaluate((wanted) => {
    const node = [...document.querySelectorAll('.plait-board-container foreignObject')].find(
      (candidate) => (candidate.textContent || '').trim() === wanted
    );
    if (!node) {
      return null;
    }
    const rect = node.getBoundingClientRect();
    return { x: Math.round(rect.x + rect.width / 2), y: Math.round(rect.y + rect.height / 2) };
  }, text);

/** Screen position of the selection marker, so keyboard navigation can be observed. */
const selectionPosition = (page: Page) =>
  page.evaluate(() => {
    const marker = document.querySelector('.plait-board-container .active-host-g');
    if (!marker) {
      return null;
    }
    const rect = marker.getBoundingClientRect();
    return { x: Math.round(rect.x), y: Math.round(rect.y) };
  });

test('arrow keys move the selection between topics once editing has been left', async ({
  page,
}) => {
  await createMindMap(page);
  await page.keyboard.type('根');
  await addTopic(page, 'Tab', 'A');

  const root = await topicPosition(page, '根');
  const child = await topicPosition(page, 'A');
  expect(root).not.toBeNull();
  expect(child).not.toBeNull();

  await page.mouse.click(root!.x, root!.y);
  await page.keyboard.press('Escape');
  await expect.poll(() => isTextEditing(page)).toBe(false);

  const before = await selectionPosition(page);
  expect(before).not.toBeNull();

  // aim at the child, whichever side the layout put it on
  await page.keyboard.press(child!.x > root!.x ? 'ArrowRight' : 'ArrowLeft');

  // the selection marker followed the key, so the map navigated
  await expect.poll(async () => await selectionPosition(page)).not.toEqual(before);
});

test('a two-sided mind map reaches the parent with the arrow that points at it', async ({
  page,
}) => {
  // Build the map with the app, then switch it to the two-sided layout, which is the
  // shape an existing `.drawnix` file can have. Plait's own navigation never reaches
  // the parent in that layout, so the arrow pointing at it is the case under test.
  await createMindMap(page);
  await page.keyboard.type('根');
  await addTopic(page, 'Tab', 'A');
  await addTopic(page, 'Tab', 'A1');
  await addTopic(page, 'Enter', 'A2');

  const a = await topicPosition(page, 'A');
  expect(a).not.toBeNull();
  await page.mouse.click(a!.x, a!.y);
  await page.keyboard.press('Escape');
  await addTopic(page, 'Enter', 'B');
  await expect.poll(() => readTopicShape(page)).toEqual(['根', '  A', '    A1', '    A2', '  B']);

  // reloading a document that declares the two-sided layout mirrors the children
  const content = await readBoardContent(page);
  expect(content?.children?.[0]).toBeTruthy();
  content!.children![0].layout = 'standard';
  await page.evaluate(
    (value) =>
      new Promise<void>((resolve) => {
        const request = indexedDB.open('Drawnix');
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction('drawnix_store', 'readwrite');
          transaction.objectStore('drawnix_store').put(value, 'main_board_content');
          transaction.oncomplete = () => {
            db.close();
            resolve();
          };
        };
      }),
    content
  );
  await page.reload();
  await expect.poll(() => readTopicShape(page)).toEqual(['根', '  A', '    A1', '    A2', '  B']);
  // the document is stored before it is drawn, so wait for the topics to render
  await expect.poll(() => renderedTopics(page)).toContain('A');

  const child = await topicPosition(page, 'A');
  const parent = await topicPosition(page, '根');
  expect(child).not.toBeNull();
  expect(parent).not.toBeNull();
  await page.mouse.click(child!.x, child!.y);
  // the popup toolbar only renders for a selected element, so this proves the click
  await expect(page.locator('.popup-toolbar')).toBeVisible();

  // the layout may mirror the children to either side, so aim at the parent
  await page.keyboard.press(parent!.x > child!.x ? 'ArrowRight' : 'ArrowLeft');

  // reaching the parent means Tab inserts a sibling of A, i.e. one level up
  await page.keyboard.press('Tab');
  const shape = await readTopicShape(page);
  expect(shape).toContain('  (empty)');
  expect(shape).not.toContain('    (empty)');
});

const readViewportOrigination = async (page: Page) =>
  (await readBoardContent(page))?.viewport?.origination ?? null;

/** Whether the selection outline sits inside the visible viewport container. */
const isSelectionVisible = (page: Page) =>
  page.evaluate(() => {
    const container = document.querySelector('.plait-board-container .viewport-container');
    const marker = document.querySelector('.plait-board-container .active-host-g');
    if (!container || !marker) {
      return false;
    }
    const view = container.getBoundingClientRect();
    const selection = marker.getBoundingClientRect();
    const margin = 4;
    return (
      selection.x >= view.x + margin &&
      selection.y >= view.y + margin &&
      selection.x + selection.width <= view.right - margin &&
      selection.y + selection.height <= view.bottom - margin
    );
  });

test('the viewport follows the selection when navigating with the keyboard', async ({ page }) => {
  await createMindMap(page);
  await page.keyboard.type('根');
  await addTopic(page, 'Tab', 'A');
  await addTopic(page, 'Tab', 'A1');
  await addTopic(page, 'Tab', 'A11');
  await addTopic(page, 'Tab', 'A111');

  const root = await topicPosition(page, '根');
  expect(root).not.toBeNull();
  await page.mouse.click(root!.x, root!.y);
  await page.keyboard.press('Escape');

  // zoom in until the deeper topics sit outside the visible area
  const zoomIn = page.locator('.zoom-in-button');
  for (let step = 0; step < 14; step++) {
    await zoomIn.click();
  }
  const before = await readViewportOrigination(page);

  // walking deeper must keep whatever is selected on screen
  for (let step = 0; step < 3; step++) {
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => isSelectionVisible(page)).toBe(true);
  }

  // and it does so by panning the viewport
  expect(await readViewportOrigination(page)).not.toEqual(before);
});
