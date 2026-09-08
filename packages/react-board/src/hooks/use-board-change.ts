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
      const isOnlySetViewport =
        isSetViewport && board.operations.every((op) => op.type === 'set_viewport');
      const fromScrolling = isFromScrolling(board);
      if (fromScrolling) {
        setIsFromScrolling(board, false);
      }
      if (isOnlySetViewport) {
        // Element layout is unchanged. Finalize the viewport before components
        // draw their active sections, so no corrective second render is needed.
        const hasZoomChanged = board.operations.some(
          (op) => op.type === 'set_viewport' && op.properties.zoom !== op.newProperties.zoom
        );
        if (!fromScrolling || hasZoomChanged) {
          initializeViewBox(board);
        }
        // Usually a no-op for native scrolling, but a later transform in the
        // same batch may have changed the origin again.
        updateViewportOffset(board);
        listRender.update(board.children, {
          board: board,
          parent: board,
          parentG: PlaitBoard.getElementHost(board),
        });
        return;
      }
      // Element changes can recompute geometry (for example, a mind layout)
      // during rendering. Preserve the post-layout refresh for these batches.
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
