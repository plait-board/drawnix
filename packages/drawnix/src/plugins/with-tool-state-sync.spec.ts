import {
  BoardTransforms,
  PlaitPointerType,
  createBoardEventObserver,
  createPointerEvent,
} from '@plait/core';
import type { PlaitPlugin } from '@plait/core';
import { BasicShapes } from '@plait/draw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { setupDrawnixTestingBoard } from '../../testing';
import type { DrawnixTestingBoardFixture } from '../../testing';
import { buildToolStateSyncPlugin, syncBoardPointerToToolState } from './with-tool-state-sync';

describe('tool state pointer sync plugin', () => {
  let fixture: DrawnixTestingBoardFixture | undefined;

  afterEach(() => {
    fixture?.destroy();
    fixture = undefined;
  });

  it('syncs the board pointer after pointer up handlers run', () => {
    const observer = createBoardEventObserver(['pointerUp']);
    const updatePointerOnPointerUp: PlaitPlugin = (board) => {
      const { pointerUp } = board;
      board.pointerUp = (event) => {
        BoardTransforms.updatePointerType(board, PlaitPointerType.selection);
        pointerUp(event);
      };
      return board;
    };
    const syncToolStatePointer = vi.fn();
    fixture = setupDrawnixTestingBoard(
      [observer.plugin, updatePointerOnPointerUp, buildToolStateSyncPlugin(syncToolStatePointer)],
      [],
      {
        pointer: BasicShapes.rectangle,
        appState: {
          toolState: {
            pointer: BasicShapes.rectangle,
          },
        },
      }
    );
    const pointerUp = createPointerEvent('pointerup', 0, 0, undefined, undefined, {
      view: null,
    });

    fixture.board.pointerUp(pointerUp);

    expect(observer.calls.pointerUp).toEqual([pointerUp]);
    expect(syncToolStatePointer).toHaveBeenCalledWith(PlaitPointerType.selection);
  });

  it('skips sync when the board and tool pointers already match', () => {
    const syncToolStatePointer = vi.fn();
    fixture = setupDrawnixTestingBoard([], [], {
      pointer: BasicShapes.rectangle,
      appState: {
        toolState: {
          pointer: BasicShapes.rectangle,
        },
      },
    });

    syncBoardPointerToToolState(fixture.board, syncToolStatePointer);

    expect(syncToolStatePointer).not.toHaveBeenCalled();
  });
});
