import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ screenshot: 'only-on-failure' });

const text = { type: 'paragraph', children: [{ text: 'Viewport' }] };
const points = [
  [300, 240],
  [420, 300],
];
const examples = {
  freehand: {
    id: 'subject',
    type: 'freehand',
    shape: 'feltTipPen',
    points,
    strokeWidth: 4,
    strokeColor: '#222222',
    fill: 'none',
  },
  rectangle: {
    id: 'subject',
    type: 'geometry',
    shape: 'rectangle',
    points,
    text,
    fill: '#ddeeff',
  },
  image: {
    id: 'subject',
    type: 'image',
    points,
    url: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><rect width="120" height="60" fill="skyblue"/></svg>')}`,
  },
  arrow: {
    id: 'subject',
    type: 'arrow-line',
    shape: 'straight',
    points,
    source: { marker: 'none' },
    target: { marker: 'arrow' },
    texts: [],
  },
  mind: {
    id: 'subject',
    type: 'mind',
    points: [[300, 240]],
    layout: 'right',
    data: { topic: text },
    children: [],
  },
};

async function loadBoard(page: Page, children: object[]) {
  await page.goto('/');
  await expect(page.locator('.drawnix')).toBeVisible();
  // Seed the app's normal persistence in this test's isolated browser context.
  // Interactions below use the UI, without exposing or invoking the board API.
  await page.evaluate(async (children) => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('Drawnix');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('drawnix_store', 'readwrite');
        const store = transaction.objectStore('drawnix_store');
        store.put({ children, viewport: { zoom: 1, origination: [0, 0] } }, 'main_board_content');
        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      };
    });
  }, children);
  await page.reload();
  await expect(page.locator('[plait-data-id="subject"]').first()).toBeVisible();
  await expect(page.locator('.zoom-menu-trigger')).toHaveText('100%');
  await page
    .getByRole('radio', { name: /选择/ })
    .locator('..')
    .click();
  await expect(page.getByRole('radio', { name: /选择/ })).toBeChecked();
}

function shape(page: Page, kind: keyof typeof examples, id = 'subject') {
  return page
    .locator(`.board-host-svg [plait-data-id="${id}"]`)
    .locator(kind === 'image' ? '.foreign-object-image' : 'path')
    .first();
}

async function bounds(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

async function expectAligned(page: Page, content: Locator) {
  const outline = page.locator('.active-host-g .selection-rectangle');
  await expect(outline).toHaveCount(1);
  await expect
    .poll(async () => {
      const actual = await bounds(outline);
      const expected = await bounds(content);
      // Selection padding, pen thickness and endpoint handles differ by element.
      // Compare all four edges in screen pixels, including native SVG layout.
      return Math.max(
        Math.abs(actual.x - expected.x),
        Math.abs(actual.y - expected.y),
        Math.abs(actual.x + actual.width - expected.x - expected.width),
        Math.abs(actual.y + actual.height - expected.y - expected.height)
      );
    })
    .toBeLessThan(8);
}

for (const kind of Object.keys(examples) as (keyof typeof examples)[]) {
  test(`${kind} selection follows zoom, scrolling and movement`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await loadBoard(page, [examples[kind]]);
    const content = shape(page, kind);
    const initial = await bounds(content);
    await page.mouse.click(initial.x + initial.width / 2, initial.y + initial.height / 2);
    await expectAligned(page, content);

    await page.locator('.zoom-in-button').click();
    await expect(page.locator('.zoom-menu-trigger')).toHaveText('110%');
    await expectAligned(page, content);
    await page.locator('.zoom-out-button').click();
    await page.locator('.zoom-out-button').click();
    await expect(page.locator('.zoom-menu-trigger')).toHaveText('90%');
    await expectAligned(page, content);

    // A large mouse-wheel step reproduces the original visible drift better
    // than tiny trackpad deltas. Wait for the event's observable zoom change.
    await page.mouse.move(550, 420);
    await page.keyboard.down('Control');
    await page.mouse.wheel(0, -120);
    await expect(page.locator('.zoom-menu-trigger')).not.toHaveText('90%');
    await page.keyboard.up('Control');
    await expectAligned(page, content);

    const beforeScroll = await bounds(content);
    await page.mouse.move(160, 550);
    await page.mouse.wheel(40, 70);
    await expect.poll(async () => (await bounds(content)).y).toBeLessThan(beforeScroll.y - 20);
    await expectAligned(page, content);

    const beforeMove = await bounds(content);
    // Avoid arrow midpoint handles and shape text editors while dragging.
    const x = beforeMove.x + beforeMove.width / 4;
    const y = beforeMove.y + beforeMove.height / 4;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 90, y + 60, { steps: 10 });
    await page.mouse.up();
    await expect.poll(async () => (await bounds(content)).x).toBeGreaterThan(beforeMove.x + 60);
    await expectAligned(page, content);
    const previousZoom = await page.locator('.zoom-menu-trigger').innerText();
    await page.locator('.zoom-in-button').click();
    await expect(page.locator('.zoom-menu-trigger')).not.toHaveText(previousZoom);
    await expectAligned(page, content);

    const screenshotPath = testInfo.outputPath(`${kind}-selection.png`);
    await page.screenshot({ path: screenshotPath });
    await testInfo.attach(`${kind}-selection`, { path: screenshotPath, contentType: 'image/png' });
    expect(errors).toEqual([]);
  });
}

test('mind selection follows a text layout change and subsequent zoom', async ({ page }) => {
  await loadBoard(page, [examples.mind]);
  const content = shape(page, 'mind');
  const initial = await bounds(content);
  await page.mouse.dblclick(initial.x + initial.width / 2, initial.y + initial.height / 2);
  const editor = page.locator('[plait-data-id="subject"] [contenteditable="true"]');
  await expect(editor).toBeVisible();
  await editor.fill('A wider mind topic after editing');
  await page.mouse.click(160, 550);
  await expect.poll(async () => (await bounds(content)).width).toBeGreaterThan(initial.width + 30);
  const resized = await bounds(content);
  await page.mouse.click(resized.x + resized.width / 2, resized.y + resized.height / 2);
  await expectAligned(page, content);
  await page.locator('.zoom-in-button').click();
  await expect(page.locator('.zoom-menu-trigger')).toHaveText('110%');
  await expectAligned(page, content);
});

test('multiple selection bounds follow zoom and native scrolling', async ({ page }) => {
  await loadBoard(page, [
    examples.freehand,
    {
      ...examples.rectangle,
      id: 'second',
      points: [
        [500, 340],
        [620, 400],
      ],
    },
  ]);
  const first = shape(page, 'freehand');
  const second = shape(page, 'rectangle', 'second');
  for (const [index, content] of [first, second].entries()) {
    const box = await bounds(content);
    if (index) await page.keyboard.down('Shift');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    if (index) await page.keyboard.up('Shift');
  }
  const outline = page.locator('.selection-rectangle-bounding');
  const check = async () => {
    await expect(outline).toHaveCount(1);
    await expect
      .poll(async () => {
        const a = await bounds(first);
        const b = await bounds(second);
        const actual = await bounds(outline);
        return Math.max(
          Math.abs(actual.x - Math.min(a.x, b.x)),
          Math.abs(actual.y - Math.min(a.y, b.y)),
          Math.abs(actual.x + actual.width - Math.max(a.x + a.width, b.x + b.width)),
          Math.abs(actual.y + actual.height - Math.max(a.y + a.height, b.y + b.height))
        );
      })
      .toBeLessThan(8);
  };
  await check();
  await page.locator('.zoom-in-button').click();
  await expect(page.locator('.zoom-menu-trigger')).toHaveText('110%');
  await check();
  const beforeScroll = await bounds(first);
  await page.mouse.move(160, 550);
  await page.mouse.wheel(40, 70);
  await expect.poll(async () => (await bounds(first)).y).toBeLessThan(beforeScroll.y - 20);
  await check();
});
