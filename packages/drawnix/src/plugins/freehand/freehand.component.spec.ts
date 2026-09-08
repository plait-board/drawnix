import {
  ACTIVE_STROKE_WIDTH,
  BOARD_TO_HOST,
  BoardTransforms,
  createSVG,
  ListRender,
  PlaitBoard,
  RESIZE_HANDLE_CLASS_NAME,
  SELECTION_RECTANGLE_CLASS_NAME,
  Transforms,
  isFromScrolling,
  updateViewportByScrolling,
  withBoard,
  withOptions,
} from '@plait/core';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useBoardChange } from '../../../../react-board/src/hooks/use-board-change';
import { setupDrawnixTestingBoard } from '../../../testing';
import { FreehandShape } from './type';
import { createFreehandElement } from './utils';
import { withFreehand } from './with-freehand';

// jsdom has no SVG layout. Model only the browser's viewBox/scroll geometry;
// viewport transforms, rendering, and the production change hook remain real.
const attachViewportLayout = (board: PlaitBoard) => {
  const container = PlaitBoard.getBoardContainer(board);
  const viewport = PlaitBoard.getViewportContainer(board);
  const host = createSVG();
  const containerRect = new DOMRect(120, 80, 800, 600);
  Object.defineProperty(container, 'getBoundingClientRect', { value: () => containerRect });
  Object.defineProperties(host, {
    viewBox: {
      get: () => {
        const [x, y, width, height] = (host.getAttribute('viewBox') || '0 0 800 600')
          .split(' ')
          .map(Number);
        return { baseVal: { x, y, width, height } };
      },
    },
    getBoundingClientRect: {
      value: () =>
        new DOMRect(
          containerRect.x - viewport.scrollLeft,
          containerRect.y - viewport.scrollTop,
          parseFloat(host.style.width),
          parseFloat(host.style.height)
        ),
    },
  });
  BOARD_TO_HOST.set(board, host);
  host.append(PlaitBoard.getElementHost(board));
  const activeSvg = createSVG();
  activeSvg.append(PlaitBoard.getActiveHost(board));
  viewport.append(host, activeSvg);
  container.append(viewport);
  return { host, viewport };
};

describe('freehand active drawing on viewport changes', () => {
  let dispose: (() => void) | undefined;

  afterEach(() => {
    dispose?.();
    dispose = undefined;
  });

  const setup = async () => {
    const element = createFreehandElement(FreehandShape.feltTipPen, [
      [300, 240],
      [350, 270],
      [420, 300],
    ]);
    const fixture = setupDrawnixTestingBoard([withOptions, withBoard, withFreehand], [element], {
      selectedElements: [element],
      withRoughSVG: true,
      withHost: false,
    });
    const { board } = fixture;
    const { host, viewport } = attachViewportLayout(board);
    const listRender = new ListRender(board);
    listRender.initialize(board.children, {
      board,
      parent: board,
      parentG: PlaitBoard.getElementHost(board),
    });
    const afterChange = vi.fn();
    const { unmount } = renderHook(() => useBoardChange(board, listRender, afterChange));
    // Observe actual RoughSVG output without replacing its drawing implementation.
    const rectangle = vi.spyOn(PlaitBoard.getRoughSVG(board), 'rectangle');
    dispose = () => {
      unmount();
      listRender.destroy();
      rectangle.mockRestore();
      BOARD_TO_HOST.delete(board);
      fixture.destroy();
    };
    await act(async () => {
      Transforms.setViewport(board, { zoom: 1, origination: [0, 0] });
    });
    expect(afterChange).toHaveBeenCalledOnce();
    afterChange.mockClear();
    rectangle.mockClear();
    return { board, element, host, viewport, rectangle, afterChange };
  };

  const expectOutline = (
    { board, rectangle }: Awaited<ReturnType<typeof setup>>,
    [x, y, width, height]: number[]
  ) => {
    const padding = (ACTIVE_STROKE_WIDTH * board.viewport.zoom) / 2;
    expect(rectangle).toHaveBeenLastCalledWith(
      x - padding,
      y - padding,
      width + padding * 2,
      height + padding * 2,
      expect.objectContaining({ strokeWidth: ACTIVE_STROKE_WIDTH })
    );
    const activeHost = PlaitBoard.getActiveHost(board);
    const outlines = activeHost.querySelectorAll(`.${SELECTION_RECTANGLE_CLASS_NAME}`);
    expect(outlines).toHaveLength(1);
    expect(outlines[0]).toBe(rectangle.mock.results[rectangle.mock.results.length - 1]?.value);
    expect(outlines[0].querySelector('path')).not.toBeNull();
    expect(activeHost.querySelectorAll(`.${RESIZE_HANDLE_CLASS_NAME}`)).toHaveLength(4);
  };

  it.each([
    { zoom: 2, bounds: [200, 180, 240, 120] },
    { zoom: 0.5, bounds: [350, 270, 60, 30] },
  ])('keeps the outline aligned after zooming to $zoom', async ({ zoom, bounds }) => {
    const state = await setup();
    const oldViewBox = state.host.getAttribute('viewBox');
    const oldScroll = [state.viewport.scrollLeft, state.viewport.scrollTop];

    await act(async () => {
      BoardTransforms.updateZoom(state.board, zoom);
      expect(state.afterChange).not.toHaveBeenCalled();
      expect(state.rectangle).not.toHaveBeenCalled();
    });

    expect(state.board.viewport.zoom).toBe(zoom);
    expect(state.host.getAttribute('viewBox')).not.toBe(oldViewBox);
    expect([state.viewport.scrollLeft, state.viewport.scrollTop]).not.toEqual(oldScroll);
    expect(state.afterChange).toHaveBeenCalledOnce();
    expect(state.board.operations).toEqual([]);
    expect(state.rectangle).toHaveBeenCalledOnce();
    expectOutline(state, bounds);
  });

  it('uses the final viewport when zoom and origin change in one cycle', async () => {
    const state = await setup();

    await act(async () => {
      Transforms.setViewport(state.board, { zoom: 2, origination: [200, 150] });
      Transforms.setViewport(state.board, { zoom: 1.5, origination: [240, 190] });
    });

    expect(state.afterChange).toHaveBeenCalledOnce();
    expect(state.board.operations).toEqual([]);
    expect(state.rectangle).toHaveBeenCalledOnce();
    expectOutline(state, [90, 75, 180, 90]);
  });

  it('keeps the outline aligned when scrolling without rebuilding the viewBox', async () => {
    const state = await setup();
    const oldViewBox = state.host.getAttribute('viewBox');

    await act(async () => {
      state.viewport.scrollLeft += 40;
      state.viewport.scrollTop += 30;
      updateViewportByScrolling(state.board, state.viewport.scrollLeft, state.viewport.scrollTop);
    });

    expect(state.host.getAttribute('viewBox')).toBe(oldViewBox);
    expect(state.board.viewport.origination).toEqual([40, 30]);
    expect(state.afterChange).toHaveBeenCalledOnce();
    expect(state.rectangle).toHaveBeenCalledOnce();
    expect(isFromScrolling(state.board)).toBe(false);
    expectOutline(state, [260, 210, 120, 60]);
  });

  it('finalizes a zoom batched after native scrolling', async () => {
    const state = await setup();
    await act(async () => {
      state.viewport.scrollLeft += 40;
      state.viewport.scrollTop += 30;
      updateViewportByScrolling(state.board, state.viewport.scrollLeft, state.viewport.scrollTop);
      BoardTransforms.updateZoom(state.board, 2);
    });
    expect(state.afterChange).toHaveBeenCalledOnce();
    expect(state.rectangle).toHaveBeenCalledOnce();
    expect(isFromScrolling(state.board)).toBe(false);
    expectOutline(state, [120, 120, 240, 120]);
  });

  it('applies an origin change batched after native scrolling', async () => {
    const state = await setup();
    await act(async () => {
      state.viewport.scrollLeft += 40;
      state.viewport.scrollTop += 30;
      updateViewportByScrolling(state.board, state.viewport.scrollLeft, state.viewport.scrollTop);
      Transforms.setViewport(state.board, { zoom: 1, origination: [80, 60] });
    });
    expect(state.rectangle).toHaveBeenCalledOnce();
    expectOutline(state, [220, 180, 120, 60]);
  });

  it('refreshes after rendering when an element change is batched with zoom', async () => {
    const state = await setup();
    await act(async () => {
      Transforms.setNode(
        state.board,
        {
          points: [
            [1000, 800],
            [1120, 860],
          ],
        },
        [0]
      );
      BoardTransforms.updateZoom(state.board, 2);
    });
    expect(state.afterChange).toHaveBeenCalledOnce();
    expectOutline(state, [1600, 1300, 240, 120]);
  });

  it('does not skip element layout in a batch that includes native scrolling', async () => {
    const state = await setup();
    const oldViewBox = state.host.getAttribute('viewBox');
    await act(async () => {
      state.viewport.scrollLeft += 40;
      state.viewport.scrollTop += 30;
      updateViewportByScrolling(state.board, state.viewport.scrollLeft, state.viewport.scrollTop);
      Transforms.setNode(
        state.board,
        {
          points: [
            [1000, 800],
            [1120, 860],
          ],
        },
        [0]
      );
    });
    expect(state.host.getAttribute('viewBox')).not.toBe(oldViewBox);
    expect(state.afterChange).toHaveBeenCalledOnce();
    expect(isFromScrolling(state.board)).toBe(false);
    expectOutline(state, [960, 770, 120, 60]);
  });
});
