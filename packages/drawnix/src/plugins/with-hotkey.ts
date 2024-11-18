import { PlaitBoard } from '@plait/core';
import { isHotkey } from 'is-hotkey';
import { saveAsPNG } from '../utils/image';

export const withDrawnixHotkey = (board: PlaitBoard) => {
  const { globalKeyDown } = board;
  board.globalKeyDown = (event: KeyboardEvent) => {
    if (
      PlaitBoard.getMovingPointInBoard(board) ||
      PlaitBoard.isMovingPointInBoard(board)
    ) {
      if (isHotkey(['mod+shift+e'], { byKey: true })(event)) {
        saveAsPNG(board);
        event.preventDefault();
        return;
      }
    }
    globalKeyDown(event);
  };

  return board;
};
