import {
  BoardTransforms,
  PlaitBoard,
  ZOOM_STEP,
  initializeViewBox,
  initializeViewportContainer,
  isFromViewportChange,
  setIsFromViewportChange,
  updateViewportByScrolling,
  updateViewportOffset,
} from '@plait/core';
import { useEffect } from 'react';
import { useEventListener } from 'ahooks';

const useBoardEvent = (
  board: PlaitBoard,
  viewportContainerRef: React.RefObject<HTMLDivElement>
) => {
  useEventListener(
    'scroll',
    (event) => {
      if (isFromViewportChange(board)) {
        setIsFromViewportChange(board, false);
      } else {
        const { scrollLeft, scrollTop } = event.target as HTMLElement;
        updateViewportByScrolling(board, scrollLeft, scrollTop);
      }
    },
    { target: viewportContainerRef }
  );

  useEventListener(
    'touchstart',
    (event) => {
      event.preventDefault();
    },
    { target: viewportContainerRef, passive: false }
  );

  useEventListener(
    'wheel',
    (event) => {
      // Credits to excalidraw
      // https://github.com/excalidraw/excalidraw/blob/b7d7ccc929696cc17b4cc34452e4afd846d59f4f/src/components/App.tsx#L9060
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        const { deltaX, deltaY } = event;
        const zoom = board.viewport.zoom;
        const sign = Math.sign(deltaY);
        const MAX_STEP = ZOOM_STEP * 100;
        const absDelta = Math.abs(deltaY);
        let delta = deltaY;
        if (absDelta > MAX_STEP) {
          delta = MAX_STEP * sign;
        }
        let newZoom = zoom - delta / 100;
        // increase zoom steps the more zoomed-in we are (applies to >100% only)
        newZoom +=
          Math.log10(Math.max(1, zoom)) *
          -sign *
          // reduced amplification for small deltas (small movements on a trackpad)
          Math.min(1, absDelta / 20);
        BoardTransforms.updateZoom(
          board,
          newZoom,
          PlaitBoard.getMovingPointInBoard(board)
        );
      }
    },
    { target: viewportContainerRef, passive: false }
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      initializeViewportContainer(board);
      initializeViewBox(board);
      updateViewportOffset(board);
    });
    resizeObserver.observe(PlaitBoard.getBoardContainer(board));
    return () => {
      resizeObserver && (resizeObserver as ResizeObserver).disconnect();
    };
  }, []);
};

export default useBoardEvent;
