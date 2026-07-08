import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  insertNode: vi.fn(),
  removeElements: vi.fn(),
}));

vi.mock('@plait/common', () => ({
  isDrawingMode: () => true,
}));

vi.mock('@plait-board/react-board', () => ({
  isTwoFingerMode: () => false,
}));

vi.mock('@plait/core', () => ({
  CoreTransforms: {
    removeElements: mocks.removeElements,
  },
  DEFAULT_COLOR: '#000000',
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

vi.mock('../../utils/laser-pointer', () => ({
  LaserPointer: class {
    destroy = vi.fn();
    init = vi.fn();
  },
}));

import { withFreehandCreate } from './with-freehand-create';
import { withFreehandErase } from './with-freehand-erase';
import { FreehandShape } from './type';

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
});
