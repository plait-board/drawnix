import { PlaitPointerType } from '@plait/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearHandSelectionBounding,
  HAND_SELECTION_BOUNDING_CLASS_NAME,
  refreshSelectionBounding,
  withHandSelectionBounding,
} from './with-hand-selection-bounding';
import type { PlaitBoard } from '@plait/core';

const mocks = vi.hoisted(() => ({
  activeHost: undefined as SVGGElement | undefined,
  getActiveHost: vi.fn(),
  getSelectedElements: vi.fn(),
  isSetViewportOperation: vi.fn(),
}));

vi.mock('@plait/core', () => ({
  getSelectedElements: mocks.getSelectedElements,
  PlaitBoard: {
    getActiveHost: mocks.getActiveHost,
  },
  PlaitOperation: {
    isSetViewportOperation: mocks.isSetViewportOperation,
  },
  PlaitPointerType: {
    hand: 'hand',
    selection: 'selection',
  },
  SELECTION_RECTANGLE_BOUNDING_CLASS_NAME: 'selection-rectangle-bounding',
}));

const createSvgG = (className?: string) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  if (className) {
    element.classList.add(className);
  }
  return element;
};

const createBoard = (overrides: Partial<PlaitBoard> = {}) =>
  ({
    pointer: PlaitPointerType.hand,
    operations: [{ type: 'set_viewport' }],
    afterChange: vi.fn(),
    onChange: vi.fn(),
    pointerDown: vi.fn(),
    drawSelectionRectangle: vi.fn(() => createSvgG('selection-rectangle-bounding')),
    ...overrides,
  }) as unknown as PlaitBoard;

describe('clearHandSelectionBounding', () => {
  beforeEach(() => {
    mocks.activeHost = createSvgG();
    mocks.getActiveHost.mockReturnValue(mocks.activeHost);
  });

  it('removes only hand-generated selection bounding rectangles', () => {
    const handBounding = createSvgG(HAND_SELECTION_BOUNDING_CLASS_NAME);
    const regularBounding = createSvgG('selection-rectangle-bounding');
    mocks.activeHost?.append(handBounding, regularBounding);
    const board = createBoard();

    clearHandSelectionBounding(board);

    expect(handBounding.isConnected).toBe(false);
    expect(mocks.activeHost?.contains(regularBounding)).toBe(true);
  });
});

describe('refreshSelectionBounding', () => {
  beforeEach(() => {
    mocks.activeHost = createSvgG();
    mocks.getActiveHost.mockReturnValue(mocks.activeHost);
    mocks.getSelectedElements.mockReturnValue([{ id: 'a' }, { id: 'b' }]);
    mocks.isSetViewportOperation.mockReset();
  });

  it('replaces stale bounding rectangles with one based on current selection', () => {
    const staleBounding = createSvgG('selection-rectangle-bounding');
    mocks.activeHost?.append(staleBounding);
    const board = createBoard();

    refreshSelectionBounding(board);

    expect(staleBounding.isConnected).toBe(false);
    expect(board.drawSelectionRectangle).toHaveBeenCalled();
    expect(
      mocks.activeHost?.querySelector(`.${HAND_SELECTION_BOUNDING_CLASS_NAME}`)
    ).not.toBeNull();
    expect(mocks.activeHost?.querySelectorAll('.selection-rectangle-bounding')).toHaveLength(1);
  });

  it('removes the stale bounding rectangle when fewer than two elements are selected', () => {
    const staleBounding = createSvgG('selection-rectangle-bounding');
    mocks.activeHost?.append(staleBounding);
    mocks.getSelectedElements.mockReturnValue([{ id: 'a' }]);
    const board = createBoard();

    refreshSelectionBounding(board);

    expect(staleBounding.isConnected).toBe(false);
    expect(board.drawSelectionRectangle).not.toHaveBeenCalled();
    expect(mocks.activeHost?.querySelectorAll('.selection-rectangle-bounding')).toHaveLength(0);
  });
});

describe('withHandSelectionBounding', () => {
  beforeEach(() => {
    mocks.activeHost = createSvgG();
    mocks.getActiveHost.mockReturnValue(mocks.activeHost);
    mocks.getSelectedElements.mockReturnValue([{ id: 'a' }, { id: 'b' }]);
    mocks.isSetViewportOperation.mockImplementation(
      (operation) => operation.type === 'set_viewport'
    );
  });

  it('refreshes selection bounding after hand viewport changes', () => {
    const staleBounding = createSvgG('selection-rectangle-bounding');
    mocks.activeHost?.append(staleBounding);
    const board = createBoard();
    const originalAfterChange = board.afterChange;

    withHandSelectionBounding(board);
    board.afterChange();

    expect(originalAfterChange).toHaveBeenCalled();
    expect(staleBounding.isConnected).toBe(false);
    expect(board.drawSelectionRectangle).toHaveBeenCalled();
  });

  it('clears hand-generated bounding before selection onChange runs', () => {
    const handBounding = createSvgG(HAND_SELECTION_BOUNDING_CLASS_NAME);
    const regularBounding = createSvgG('selection-rectangle-bounding');
    mocks.activeHost?.append(handBounding, regularBounding);
    const board = createBoard({
      pointer: PlaitPointerType.selection,
    });
    const originalOnChange = board.onChange;

    withHandSelectionBounding(board);
    board.onChange();

    expect(originalOnChange).toHaveBeenCalled();
    expect(handBounding.isConnected).toBe(false);
    expect(mocks.activeHost?.contains(regularBounding)).toBe(true);
  });

  it('clears hand-generated bounding after non-hand afterChange runs', () => {
    const handBounding = createSvgG(HAND_SELECTION_BOUNDING_CLASS_NAME);
    mocks.activeHost?.append(handBounding);
    const board = createBoard({
      pointer: PlaitPointerType.selection,
    });

    withHandSelectionBounding(board);
    board.afterChange();

    expect(handBounding.isConnected).toBe(false);
    expect(board.drawSelectionRectangle).not.toHaveBeenCalled();
  });

  it('does not refresh selection bounding outside hand viewport changes', () => {
    const board = createBoard({
      pointer: PlaitPointerType.selection,
    });

    withHandSelectionBounding(board);
    board.afterChange();

    expect(board.drawSelectionRectangle).not.toHaveBeenCalled();
  });
});
