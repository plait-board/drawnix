import type { PlaitBoard } from '@plait/core';
import type { DrawnixBoard, DrawnixPointerType } from '../hooks/use-drawnix';

export const syncBoardPointerToToolState = (
  board: PlaitBoard,
  syncToolStatePointer: (pointer: DrawnixPointerType) => void
) => {
  const toolState = (board as DrawnixBoard).appState?.toolState;

  if (!toolState || toolState.pointer === board.pointer) {
    return;
  }

  syncToolStatePointer(board.pointer as DrawnixPointerType);
};

export const buildToolStateSyncPlugin = (
  syncToolStatePointer: (pointer: DrawnixPointerType) => void
) => {
  const withToolStateSync = (board: PlaitBoard) => {
    const { pointerUp, globalPointerUp } = board;

    board.pointerUp = (event: PointerEvent) => {
      pointerUp(event);
      syncBoardPointerToToolState(board, syncToolStatePointer);
    };

    board.globalPointerUp = (event: PointerEvent) => {
      globalPointerUp(event);
      syncBoardPointerToToolState(board, syncToolStatePointer);
    };

    return board;
  };

  return withToolStateSync;
};
