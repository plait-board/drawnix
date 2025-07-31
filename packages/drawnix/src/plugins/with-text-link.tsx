import {
  isMovingElements,
  PlaitBoard,
  PlaitPointerType,
  throttleRAF,
} from '@plait/core';
import { DrawnixBoard, DrawnixState } from '../hooks/use-drawnix';
import { ReactEditor } from 'slate-react';
import { Editor } from 'slate';
import { isResizing, LinkElement } from '@plait/common';

export const isHovering = (board: PlaitBoard) => {
  const { appState } = board as DrawnixBoard;
  const isHovering =
    appState && appState.linkState && appState.linkState.isHovering;
  return isHovering;
};

export const isHoveringOrigin = (board: PlaitBoard) => {
  const { appState } = board as DrawnixBoard;
  const isHoveringOrigin =
    appState && appState.linkState && appState.linkState.isHoveringOrigin;
  return isHoveringOrigin;
};

export const isEditing = (board: PlaitBoard) => {
  const { appState } = board as DrawnixBoard;
  const isEditing =
    appState && appState.linkState && appState.linkState.isEditing;
  return isEditing;
};

export const buildTextLinkPlugin = (
  updateAppState: (appState: Partial<DrawnixState>) => void
) => {
  const withTextLink = (board: PlaitBoard) => {
    const { pointerMove } = board;

    let target: HTMLElement | null = null;

    let timeoutId: any | null = null;

    board.pointerMove = (event: PointerEvent) => {
      if (
        (PlaitBoard.isPointer(board, PlaitPointerType.selection) ||
          PlaitBoard.isPointer(board, PlaitPointerType.hand)) &&
        !isMovingElements(board) &&
        !isResizing(board) &&
        !isHovering(board) &&
        !isEditing(board)
      ) {
        throttleRAF(board, 'with-text-link', () => {
          const textLinkDom = (event.target as HTMLElement).closest(
            '.plait-board-link'
          ) as HTMLElement | null;
          if (textLinkDom && textLinkDom !== target) {
            const editable = textLinkDom.closest(
              '.plait-text-container'
            ) as HTMLElement;
            const editor = ReactEditor.toSlateNode(
              undefined as unknown as Editor,
              editable
            ) as Editor;
            const node = ReactEditor.toSlateNode(
              undefined as unknown as Editor,
              textLinkDom
            ) as LinkElement;
            target = textLinkDom;
            updateAppState({
              linkState: {
                targetDom: textLinkDom,
                targetElement: node,
                editor,
                isEditing: false,
                isHovering: false,
                isHoveringOrigin: true,
              },
            });
            clearTimeout(timeoutId);
          } else {
            if (!textLinkDom && target) {
              timeoutId = setTimeout(() => {
                if (!isHovering(board) && !isEditing(board)) {
                  updateAppState({
                    linkState: null,
                  });
                }
              }, 300);
              target = null;
            }
          }
        });
      }
      pointerMove(event);
    };

    return board;
  };
  return withTextLink;
};
