import { PlaitBoard, PlaitPointerType } from '@plait/core';
import { DrawnixState } from '../hooks/use-drawnix';
import { ReactEditor } from 'slate-react';
import { Editor } from 'slate';
import { LinkElement } from '@plait-board/react-text';

export const buildTextLinkPlugin = (
  appState: DrawnixState,
  setAppState: (appState: DrawnixState) => void
) => {
  const withTextLink = (board: PlaitBoard) => {
    const { pointerMove } = board;

    let target: HTMLElement | null = null;

    let timeoutId: any | null = null;

    board.pointerMove = (event: PointerEvent) => {
      if (
        PlaitBoard.isPointer(board, PlaitPointerType.selection) ||
        PlaitBoard.isPointer(board, PlaitPointerType.hand)
      ) {
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
          setAppState({
            ...appState,
            linkState: {
              targetDom: textLinkDom,
              targetElement: node,
              editor,
            },
          });
          clearTimeout(timeoutId);
        } else {
          if (!textLinkDom && target) {
            timeoutId = setTimeout(() => {
              setAppState({
                ...appState,
                linkState: null,
              });
            }, 300);
            target = null;
          }
        }
      }
      pointerMove(event);
    };

    return board;
  };
  return withTextLink;
};
