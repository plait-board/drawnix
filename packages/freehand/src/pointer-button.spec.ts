import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  insertNode: vi.fn(),
  removeElements: vi.fn(),
}));

vi.mock('@plait/common', () => ({
  isDrawingMode: () => true,
}));

vi.mock('@plait/core', () => ({
  CoreTransforms: {
    removeElements: mocks.removeElements,
  },
  DEFAULT_COLOR: '#000000',
  idCreator: () => 'freehand-id',
  PlaitBoard: {
    getElementTopHost: () => ({}),
    getPointer: (board: { pointer: string }) => board.pointer,
    isInPointer: (board: { pointer: string }, pointers: string[]) =>
      pointers.includes(board.pointer),
  },
  PlaitElement: {
    getElementG: () => ({ style: {} }),
  },
  ThemeColorMode: {
    colorful: 'colorful',
    dark: 'dark',
    default: 'default',
    retro: 'retro',
    soft: 'soft',
    starry: 'starry',
  },
  Transforms: {
    insertNode: mocks.insertNode,
  },
  distanceBetweenPointAndPoint: (x1: number, y1: number, x2: number, y2: number) =>
    Math.hypot(x2 - x1, y2 - y1),
  isMainPointer: (event: MouseEvent) => event.button === 0,
  throttleRAF: (_board: unknown, _key: string, callback: () => void) => callback(),
  toHostPoint: (_board: unknown, x: number, y: number) => [x, y],
  toViewBoxPoint: (_board: unknown, point: [number, number]) => point,
}));

vi.mock('./freehand.generator', () => ({
  FreehandGenerator: class {
    destroy = vi.fn();
    processDrawing = vi.fn();
  },
}));

vi.mock('./smoother', () => ({
  FreehandSmoother: class {
    process(point: [number, number]) {
      return point;
    }
    reset = vi.fn();
  },
}));

import { withFreehandCreate } from './with-freehand-create';
import { withFreehandErase } from './with-freehand-erase';
import { FreehandShape } from './type';
import { setFreehandPluginOptions } from './plugin-options';

const createPointerEvent = (button: number) =>
  ({
    button,
    x: 10,
    y: 10,
  }) as PointerEvent;

const createBoard = (pointer: string) => ({
  children: [],
  globalPointerUp: vi.fn(),
  pointer,
  pointerDown: vi.fn(),
  pointerMove: vi.fn(),
  pointerUp: vi.fn(),
  theme: {
    themeColorMode: 'default',
  },
  touchStart: vi.fn(),
});

describe('freehand pointer buttons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not start freehand drawing from the middle mouse button', () => {
    const board = createBoard(FreehandShape.feltTipPen);
    const originalPointerDown = board.pointerDown;

    withFreehandCreate(board as any);

    board.pointerDown(createPointerEvent(1));
    board.pointerMove(createPointerEvent(1));
    board.pointerUp(createPointerEvent(1));

    expect(originalPointerDown).toHaveBeenCalledOnce();
    expect(mocks.insertNode).not.toHaveBeenCalled();
  });

  it('does not start freehand erasing from the middle mouse button', () => {
    const board = createBoard(FreehandShape.eraser);
    const originalPointerDown = board.pointerDown;

    withFreehandErase(board as any);

    board.pointerDown(createPointerEvent(1));
    board.pointerMove(createPointerEvent(1));
    board.pointerUp(createPointerEvent(1));

    expect(originalPointerDown).toHaveBeenCalledOnce();
    expect(mocks.removeElements).not.toHaveBeenCalled();
  });

  it('uses application-provided draw options without reading application state', () => {
    const board = createBoard(FreehandShape.feltTipPen);
    setFreehandPluginOptions(board as any, {
      getDrawOptions: () => ({
        strokeColor: '#FF4500',
        strokeWidth: 6,
      }),
    });

    withFreehandCreate(board as any);
    board.pointerDown(createPointerEvent(0));
    board.pointerUp(createPointerEvent(0));

    expect(mocks.insertNode).toHaveBeenCalledWith(
      board,
      expect.objectContaining({
        id: 'freehand-id',
        strokeColor: '#FF4500',
        strokeWidth: 6,
      }),
      [0]
    );
  });

  it('uses an application-provided eraser trail lifecycle', () => {
    const board = createBoard(FreehandShape.eraser);
    const eraseTrail = {
      init: vi.fn(),
      destroy: vi.fn(),
    };
    setFreehandPluginOptions(board as any, {
      createEraseTrail: () => eraseTrail,
    });

    withFreehandErase(board as any);
    board.pointerDown(createPointerEvent(0));
    board.pointerUp(createPointerEvent(0));

    expect(eraseTrail.init).toHaveBeenCalledWith(board);
    expect(eraseTrail.destroy).toHaveBeenCalledOnce();
  });

  it('cancels an active stroke when application interaction policy blocks it', () => {
    const board = createBoard(FreehandShape.feltTipPen);
    setFreehandPluginOptions(board as any, {
      isInteractionBlocked: () => true,
    });

    withFreehandCreate(board as any);
    board.pointerDown(createPointerEvent(0));
    board.pointerMove(createPointerEvent(0));
    board.pointerUp(createPointerEvent(0));

    expect(mocks.insertNode).not.toHaveBeenCalled();
  });
});
