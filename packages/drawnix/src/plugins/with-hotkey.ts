import { BoardTransforms, getSelectedElements, PlaitBoard, PlaitPointerType } from '@plait/core';
import { isHotkey } from 'is-hotkey';
import { addImage, canCopySelectionAs, copySelectionAsSvg, saveAsSvg } from '../utils/image';
import { saveAsJSON, saveJSON } from '../data/json';
import {
  DrawnixBoard,
  DrawnixFreehandPointer,
  DrawnixPointerType,
  DrawnixState,
  DrawnixToolState,
} from '../hooks/use-drawnix';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { MindPointerType } from '@plait/mind';
import { FreehandShape } from './freehand/type';
import { ArrowLineShape, BasicShapes } from '@plait/draw';

export const buildDrawnixHotkeyPlugin = (
  updateAppState: (appState: Partial<DrawnixState>) => void
) => {
  const withDrawnixHotkey = (board: PlaitBoard) => {
    const { globalKeyDown, keyDown } = board;
    const updatePointer = (
      pointer: DrawnixPointerType,
      nextToolState: Partial<DrawnixToolState> = {}
    ) => {
      updateAppState({
        toolState: {
          ...(board as DrawnixBoard).appState.toolState,
          pointer,
          ...nextToolState,
        },
      });
    };
    board.globalKeyDown = (event: KeyboardEvent) => {
      const isTypingNormal =
        event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      if (
        !isTypingNormal &&
        (PlaitBoard.getMovingPointInBoard(board) || PlaitBoard.isMovingPointInBoard(board)) &&
        !PlaitBoard.hasBeenTextEditing(board)
      ) {
        if (isHotkey(['mod+shift+e'], { byKey: true })(event)) {
          saveAsSvg(board);
          event.preventDefault();
          return;
        }
        if (isHotkey(['mod+shift+s'], { byKey: true })(event)) {
          saveAsJSON(board).then(({ fileHandle }) => {
            updateAppState({ fileHandle });
          });
          event.preventDefault();
          return;
        }
        if (isHotkey(['mod+s'], { byKey: true })(event)) {
          saveJSON(board, (board as DrawnixBoard).appState.fileHandle).then(({ fileHandle }) => {
            updateAppState({ fileHandle });
          });
          event.preventDefault();
          return;
        }
        if (isHotkey(['mod+backspace'])(event) || isHotkey(['mod+delete'])(event)) {
          updateAppState({
            openCleanConfirm: true,
          });
          event.preventDefault();
          return;
        }
        if (isHotkey(['mod+u'])(event)) {
          addImage(board);
          event.preventDefault();
          return;
        }
        if (!event.altKey && !event.metaKey && !event.ctrlKey) {
          if (event.key === 'h') {
            BoardTransforms.updatePointerType(board, PlaitPointerType.hand);
            updatePointer(PlaitPointerType.hand);
            event.preventDefault();
            return;
          }
          if (event.key === 'v') {
            BoardTransforms.updatePointerType(board, PlaitPointerType.selection);
            updatePointer(PlaitPointerType.selection);
            event.preventDefault();
            return;
          }
          if (event.key === 'm') {
            setCreationMode(board, BoardCreationMode.dnd);
            BoardTransforms.updatePointerType(board, MindPointerType.mind);
            updatePointer(MindPointerType.mind);
            event.preventDefault();
            return;
          }
          if (event.key === 'e') {
            setCreationMode(board, BoardCreationMode.drawing);
            BoardTransforms.updatePointerType(board, FreehandShape.eraser);
            updatePointer(FreehandShape.eraser, {
              lastFreehandPointer: FreehandShape.eraser as DrawnixFreehandPointer,
            });
            event.preventDefault();
            return;
          }
          if (event.key === 'p') {
            setCreationMode(board, BoardCreationMode.drawing);
            BoardTransforms.updatePointerType(board, FreehandShape.feltTipPen);
            updatePointer(FreehandShape.feltTipPen, {
              lastFreehandPointer: FreehandShape.feltTipPen as DrawnixFreehandPointer,
            });
            event.preventDefault();
            return;
          }
          if (event.key === 'a' && !isHotkey(['mod+a'])(event)) {
            // will trigger editing text
            if (getSelectedElements(board).length === 0) {
              setCreationMode(board, BoardCreationMode.drawing);
              BoardTransforms.updatePointerType(board, ArrowLineShape.straight);
              updatePointer(ArrowLineShape.straight, {
                lastArrowPointer: ArrowLineShape.straight,
              });
              event.preventDefault();
              return;
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
            if (keyToPointer[event.key] === BasicShapes.text) {
              updatePointer(keyToPointer[event.key]);
            } else {
              updatePointer(keyToPointer[event.key], {
                lastShapePointer: keyToPointer[event.key],
              });
            }
            event.preventDefault();
            return;
          }
        }
        if (isHotkey('shift+alt+c')(event)) {
          const canCopySvg = canCopySelectionAs('svg');
          if (canCopySvg) {
            copySelectionAsSvg(board).catch(() => undefined);
            event.preventDefault();
          }

          return;
        }
      }
      globalKeyDown(event);
    };

    board.keyDown = (event: KeyboardEvent) => {
      if (isHotkey(['mod+z'], { byKey: true })(event)) {
        board.undo();
        event.preventDefault();
        return;
      }

      if (isHotkey(['mod+shift+z'], { byKey: true })(event)) {
        board.redo();
        event.preventDefault();
        return;
      }

      keyDown(event);
    };

    return board;
  };
  return withDrawnixHotkey;
};
