# Viewport lifecycle and selection regressions

Follow-up to [#461](https://github.com/plait-board/drawnix/issues/461) and the
selection-outline fix in [#454](https://github.com/plait-board/drawnix/pull/454).

## Lifecycle finding

Previously, the React board change cycle updated `ListRender`, updated the SVG
viewBox, applied the viewport scroll offset, and then refreshed selected elements'
active sections. The first draw could see the new zoom together with the previous
viewBox and scroll offset. The final `updateActiveSection` pass corrected it, but
also redrew the same selection outline.

`useBoardChange` now distinguishes batches containing only `set_viewport`
operations. Element layout is unchanged in these batches, so it finalizes the
viewBox and scroll offset **before** `ListRender.update()`. Selected components
draw against those final inputs once, without a corrective active-section pass.
Native scrolling keeps its existing viewBox unless the same batch changes zoom;
the final origin is still applied if another viewport transform follows scrolling.

Selection-only updates retain their existing path. Batches containing element
changes retain rendering before viewport calculation and the final active-section
refresh: mind nodes can recompute their layout during component context updates.
A batch containing both scrolling and element changes must also take this path,
instead of the previous scrolling shortcut that skipped layout updates.

This resolves the redundant pass for viewport-only updates in the React board.
It does not remove the component `updateActiveSection` contract or provide a new
overlay lifecycle for every kind of data change. Removing that contract requires
coordinated changes to the Plait components' layout and rendering phases.

## Test boundary

`freehand.component.spec.ts` uses `setupDrawnixTestingBoard`, explicit plugins,
real `ListRender`, the production change hook, real viewport transforms, and real
RoughSVG drawing. React's async `act` flushes the board's microtask change cycle.
The tests check exact outline coordinates, the actual SVG node mounted in the
active host, resize handles, and exactly one draw for pure viewport updates.
They cover zoom in/out, batched zoom/origin changes, native scrolling, scrolling
followed by a zoom/origin override, and element changes batched with zoom/scrolling.
Moving the pure-viewport render back before viewport finalization makes five of
these tests fail on incorrect coordinates; the production order was restored
after this mutation check.

Only jsdom's missing SVG layout is supplied locally: the board container has a
fixed nonzero screen offset, the SVG viewBox reflects its current attribute, and
the SVG screen position follows the viewport's scroll offsets. Drawing calls are
observed with a call-through spy. No Plait module or drawing implementation is
mocked. These tests do not emulate browser scroll clamping, native event timing,
or pixel rasterization.

`apps/web-e2e/src/viewport.spec.ts` complements them with Chromium, Firefox and
WebKit tests. Each test seeds the normal IndexedDB board content in an isolated
browser context, then selects elements and operates the real toolbar, mouse wheel,
and drag interactions. Freehand, rectangle, image, straight arrow, mind root,
multiple selection, and mind text layout changes are covered. Assertions compare
the selection outline to rendered SVG geometry on screen; the browser tolerance
allows selection padding, stroke width and endpoint handles. These checks do not
replace the unit tests' exact coordinate and draw-count assertions. Final
single-element screenshots are attached to the Playwright report.

Run the focused suite from the repository root:

```sh
npx vitest run --config packages/drawnix/vite.config.ts packages/drawnix/src/plugins/freehand/freehand.component.spec.ts
npx playwright test --config apps/web-e2e/playwright.config.ts --workers=3
```
