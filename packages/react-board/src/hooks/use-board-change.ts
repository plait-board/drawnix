import {
  BOARD_TO_AFTER_CHANGE,
  BOARD_TO_ON_CHANGE,
  getSelectedElements,
  initializeViewBox,
  isFromScrolling,
  ListRender,
  PlaitBoard,
  PlaitElement,
  setIsFromScrolling,
  updateViewBox,
  updateViewportOffset,
} from '@plait/core';
import { PlaitCommonElementRef } from '@plait/common';
import { useEffect } from 'react';

export const useBoardChange = (
  board: PlaitBoard,
  listRender: ListRender,
  onContextChange: () => void
) => {
  useEffect(() => {
    BOARD_TO_ON_CHANGE.set(board, () => {
      const isOnlySetSelection =
        board.operations.length && board.operations.every((op) => op.type === 'set_selection');
      if (isOnlySetSelection) {
        listRender.update(board.children, {
          board: board,
          parent: board,
          parentG: PlaitBoard.getElementHost(board),
        });
        return;
      }
      const isSetViewport =
        board.operations.length && board.operations.some((op) => op.type === 'set_viewport');
      if (isSetViewport && isFromScrolling(board)) {
        setIsFromScrolling(board, false);
        listRender.update(board.children, {
          board: board,
          parent: board,
          parentG: PlaitBoard.getElementHost(board),
        });
        return;
      }
      listRender.update(board.children, {
        board: board,
        parent: board,
        parentG: PlaitBoard.getElementHost(board),
      });
      if (isSetViewport) {
        initializeViewBox(board);
      } else {
        updateViewBox(board);
      }
      updateViewportOffset(board);
      const selectedElements = getSelectedElements(board);
      selectedElements.forEach((element) => {
        const elementRef = PlaitElement.getElementRef<PlaitCommonElementRef>(element);
        elementRef.updateActiveSection();
      });
    });

    BOARD_TO_AFTER_CHANGE.set(board, () => {
      onContextChange();
    });

    return () => {
      BOARD_TO_ON_CHANGE.delete(board);
      BOARD_TO_AFTER_CHANGE.delete(board);
    };
  }, [board, listRender, onContextChange]);
};
