import {
  BoardTransforms,
  getSelectedElements,
  PlaitBoard,
  PlaitPointerType,
} from '@plait/core';
import { isHotkey } from 'is-hotkey';
import { addImage, saveAsImage } from '../utils/image';
import { saveAsJSON } from '../data/json';
import { DrawnixState } from '../hooks/use-drawnix';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { MindPointerType } from '@plait/mind';
import { FreehandShape } from './freehand/type';
import { ArrowLineShape, BasicShapes } from '@plait/draw';

export const buildDrawnixHotkeyPlugin = (
  updateAppState: (appState: Partial<DrawnixState>) => void
) => {
  const withDrawnixHotkey = (board: PlaitBoard) => {
    const { globalKeyDown } = board;
    board.globalKeyDown = (event: KeyboardEvent) => {
      const isTypingNormal =
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement;
      if (
        !isTypingNormal &&
        (PlaitBoard.getMovingPointInBoard(board) ||
          PlaitBoard.isMovingPointInBoard(board)) &&
        !PlaitBoard.hasBeenTextEditing(board)
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
          updateAppState({
            openCleanConfirm: true,
          });
          event.preventDefault();
          return;
        }
        if (event.key === 'h') {
          BoardTransforms.updatePointerType(board, PlaitPointerType.hand);
          updateAppState({ pointer: PlaitPointerType.hand });
        }
        if (event.key === 'v') {
          BoardTransforms.updatePointerType(board, PlaitPointerType.selection);
          updateAppState({ pointer: PlaitPointerType.selection });
        }
        if (event.key === 'm') {
          setCreationMode(board, BoardCreationMode.dnd);
          BoardTransforms.updatePointerType(board, MindPointerType.mind);
          updateAppState({ pointer: MindPointerType.mind });
        }
        if (event.key === 'p') {
          setCreationMode(board, BoardCreationMode.drawing);
          BoardTransforms.updatePointerType(board, FreehandShape.feltTipPen);
          updateAppState({ pointer: FreehandShape.feltTipPen });
        }
        if (event.key === 'a' && !isHotkey(['mod+a'])(event)) {
          // will trigger editing text
          if (getSelectedElements(board).length === 0) {
            setCreationMode(board, BoardCreationMode.drawing);
            BoardTransforms.updatePointerType(board, ArrowLineShape.straight);
            updateAppState({ pointer: ArrowLineShape.straight });
          }
        }
        if (event.key === 'r' || event.key === 'o' || event.key === 't') {
          const keyToPointer = {
            r: BasicShapes.rectangle,
            o: BasicShapes.ellipse,
            t: BasicShapes.text,
          };
          if (keyToPointer[event.key] === BasicShapes.text) {
            setCreationMode(board, BoardCreationMode.dnd);
          } else {
            setCreationMode(board, BoardCreationMode.drawing);
          }
          BoardTransforms.updatePointerType(board, keyToPointer[event.key]);
          updateAppState({ pointer: keyToPointer[event.key] });
        }
        if (isHotkey(['mod+u'])(event)) {
          addImage(board);
        }
      }
      globalKeyDown(event);
    };

    return board;
  };
  return withDrawnixHotkey;
};
