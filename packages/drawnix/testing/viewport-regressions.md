# Freehand viewport regression coverage

Follow-up to [#461](https://github.com/plait-board/drawnix/issues/461) and the
selection-outline fix in [#454](https://github.com/plait-board/drawnix/pull/454).

## Lifecycle finding

The React board change cycle updates `ListRender`, updates the SVG viewBox,
applies the viewport scroll offset, and then refreshes selected elements' active
sections. During the first pass of a viewport change, a selected freehand element
can see the new zoom together with the previous viewBox and scroll offset. Its outline
must be redrawn after those layout inputs have been updated.

Keep the final `updateActiveSection` pass under the current architecture. Simply
removing it, or removing the freehand component's implementation, produces wrong
outline coordinates. Both mutations were checked against the regression suite:
the zoom-in, zoom-out, and batched viewport cases fail; the scrolling case passes
because scrolling updates the layout inputs before the render cycle.

`useBoardChange` contains the existing Wrapper effect without changing its order
or branches. It is internal to `react-board`, allowing this suite to exercise the
production lifecycle rather than reproducing it in a test callback. A shared
single-pass overlay lifecycle remains a separate design change: it needs to
account for element initialization/context updates, viewBox calculation, and all
overlay implementations, beyond the freehand behavior covered here.

## Test boundary

`freehand.component.spec.ts` uses `setupDrawnixTestingBoard`, explicit plugins,
real `ListRender`, the production change hook, real viewport transforms, and real
RoughSVG drawing. React's async `act` flushes the board's microtask change cycle.
The tests check outline coordinates, the actual SVG node mounted in the active
host, and resize handles after zooming, batched viewport changes, and scrolling.

Only jsdom's missing SVG layout is supplied locally: the board container has a
fixed nonzero screen offset, the SVG viewBox reflects its current attribute, and
the SVG screen position follows the viewport's scroll offsets. Drawing calls are
observed with a call-through spy. No Plait module or drawing implementation is
mocked. These tests do not emulate browser scroll clamping, native event timing,
or pixel rasterization; those remain browser-test concerns.

Run the focused suite from the repository root:

```sh
npx vitest run --config packages/drawnix/vite.config.ts packages/drawnix/src/plugins/freehand/freehand.component.spec.ts
```
