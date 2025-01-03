import {
  BoardTransforms,
  distanceBetweenPointAndPoint,
  getPointBetween,
  MAX_ZOOM,
  MIN_ZOOM,
  PlaitBoard,
  Point,
  throttleRAF,
  toHostPoint,
  toViewBoxPoint,
} from '@plait/core';

export const withPinchZoom = (board: PlaitBoard) => {
  const { pointerDown, pointerMove, pointerUp, globalPointerUp } = board;
  let isPinching = false;
  let initialDistance = 0;
  let initialZoom = 1;
  let lastZoom = 1;
  let touchPoints: {
    [key: number]: [number, number];
  } = {};
  let pinchCenter: Point | null = null;

  board.pointerDown = (event: PointerEvent) => {
    const point = [event.x, event.y] as Point;
    touchPoints[event.pointerId] = point;
    const touchPointsCount = Object.keys(touchPoints).length;
    if (touchPointsCount === 2) {
      isPinching = true;
      const points = Object.values(touchPoints);
      initialDistance = distanceBetweenPointAndPoint(
        points[0][0],
        points[0][1],
        points[1][0],
        points[1][1]
      );
      initialZoom = board.viewport.zoom;
      lastZoom = initialZoom;
      pinchCenter = getPointBetween(
        ...toViewBoxPoint(
          board,
          toHostPoint(board, points[0][0], points[0][1])
        ),
        ...toViewBoxPoint(board, toHostPoint(board, points[1][0], points[1][1]))
      ) as Point;
      return;
    }
    pointerDown(event);
  };

  board.pointerMove = (event: PointerEvent) => {
    if (isPinching) {
      const point = [event.x, event.y] as Point;
      touchPoints[event.pointerId] = point;
      const points = Object.values(touchPoints);
      if (points.length === 2) {
        const currentDistance = distanceBetweenPointAndPoint(
          points[0][0],
          points[0][1],
          points[1][0],
          points[1][1]
        );
        const scale = currentDistance / initialDistance;
        const nextZoom = Math.min(
          Math.max(initialZoom * scale, MIN_ZOOM),
          MAX_ZOOM
        );
        throttleRAF(board, 'pinch-zoom', () => {
          pinchCenter &&
            BoardTransforms.updateZoom(board, nextZoom, pinchCenter);
        });
      }
      return;
    }

    pointerMove(event);
  };

  board.pointerUp = (event: PointerEvent) => {
    delete touchPoints[event.pointerId];
    if (Object.keys(touchPoints).length < 2) {
      isPinching = false;
      initialDistance = 0;
      initialZoom = 1;
      lastZoom = 1;
    }
    pointerUp(event);
  };

  board.globalPointerUp = (event: PointerEvent) => {
    touchPoints = {};
    isPinching = false;
    initialDistance = 0;
    initialZoom = 1;
    lastZoom = 1;
    globalPointerUp(event);
  };

  return board;
};
