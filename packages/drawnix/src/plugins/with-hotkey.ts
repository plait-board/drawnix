import { PlaitBoard } from '@plait/core';
import { isHotkey } from 'is-hotkey';
import { saveAsPNG } from '../utils/image';
import { saveAsJSON } from '../data/json';
import { DrawnixState } from '../hooks/use-drawnix';

export const buildDrawnixHotkeyPlugin = (
  appState: DrawnixState,
  setAppState: (appState: DrawnixState) => void
) => {
  const withDrawnixHotkey = (board: PlaitBoard) => {
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
        if (isHotkey(['mod+s'], { byKey: true })(event)) {
          saveAsJSON(board);
          event.preventDefault();
          return;
        }
        if (isHotkey(['mod+k'], { byKey: true })(event)) {
          setAppState({
            ...appState,
            openResetConfirm: true,
          });
          event.preventDefault();
          return;
        }
      }
      globalKeyDown(event);
    };

    return board;
  };
  return withDrawnixHotkey;
};
