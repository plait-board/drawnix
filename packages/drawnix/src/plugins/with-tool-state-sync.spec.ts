import { PlaitPointerType } from '@plait/core';
import { BasicShapes } from '@plait/draw';
import { describe, expect, it, vi } from 'vitest';
import type { DrawnixBoard } from '../hooks/use-drawnix';
import {
  buildToolStateSyncPlugin,
  syncBoardPointerToToolState,
} from './with-tool-state-sync';

vi.mock('@plait/core', () => ({
  PlaitPointerType: {
    hand: 'hand',
    selection: 'selection',
  },
}));

vi.mock('@plait/draw', () => ({
  ArrowLineShape: {
    straight: 'straight',
  },
  BasicShapes: {
    rectangle: 'rectangle',
  },
}));

vi.mock('@plait/mind', () => ({
  MindPointerType: {
    mind: 'mind',
  },
}));

vi.mock('../plugins/freehand/type', () => ({
  FreehandShape: {
    feltTipPen: 'feltTipPen',
    eraser: 'eraser',
  },
}));

const createBoard = (): DrawnixBoard =>
  ({
    pointer: BasicShapes.rectangle,
    appState: {
      toolState: {
        pointer: BasicShapes.rectangle,
        lastShapePointer: BasicShapes.rectangle,
        lastArrowPointer: 'straight',
        lastFreehandPointer: 'feltTipPen',
        activeFreehandPresetIndex: 0,
        freehandPresets: [],
      },
    },
    pointerUp: vi.fn(),
    globalPointerUp: vi.fn(),
  }) as unknown as DrawnixBoard;

describe('tool state pointer sync plugin', () => {
  it('syncs the board pointer after pointer up handlers run', () => {
    const board = createBoard();
    const syncToolStatePointer = vi.fn();
    board.pointerUp = vi.fn(() => {
      board.pointer = PlaitPointerType.selection;
    });

    buildToolStateSyncPlugin(syncToolStatePointer)(board);
    board.pointerUp({} as PointerEvent);

    expect(syncToolStatePointer).toHaveBeenCalledWith(
      PlaitPointerType.selection
    );
  });

  it('skips sync when the board and tool pointers already match', () => {
    const board = createBoard();
    const syncToolStatePointer = vi.fn();

    syncBoardPointerToToolState(board, syncToolStatePointer);

    expect(syncToolStatePointer).not.toHaveBeenCalled();
  });
});
