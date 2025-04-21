import { PlaitBoard } from '@plait/core';
import { isHotkey } from 'is-hotkey';
import { saveAsImage } from '../utils/image';
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
          saveAsImage(board, true);
          event.preventDefault();
          return;
        }
        if (isHotkey(['mod+s'], { byKey: true })(event)) {
          saveAsJSON(board);
          event.preventDefault();
          return;
        }
        if (
          isHotkey(['mod+backspace'])(event) ||
          isHotkey(['mod+delete'])(event)
        ) {
          setAppState({
            ...appState,
            openCleanConfirm: true,
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
