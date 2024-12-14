import {
  BoardTransforms,
  distanceBetweenPointAndPoint,
  MAX_ZOOM,
  MIN_ZOOM,
  PlaitBoard,
  Point,
  throttleRAF,
  toHostPoint,
  toViewBoxPoint,
  ZOOM_STEP,
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

  const getMidPoint = (
    p1: [number, number],
    p2: [number, number]
  ): [number, number] => {
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  };

  const calculateSmoothedZoom = (
    rawZoom: number,
    currentZoom: number
  ): number => {
    const sign = Math.sign(rawZoom - lastZoom);
    const delta = Math.abs(rawZoom - lastZoom);
    const MAX_STEP = ZOOM_STEP * 100;
    let adjustedDelta = delta;
    if (delta > MAX_STEP) {
      adjustedDelta = MAX_STEP;
    }
    let newZoom = currentZoom + adjustedDelta * sign;
    newZoom +=
      Math.log10(Math.max(1, currentZoom)) * sign * Math.min(1, delta / 20);
    newZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
    lastZoom = newZoom;
    return newZoom;
  };

  board.pointerDown = (event: PointerEvent) => {
    const point = toViewBoxPoint(board, toHostPoint(board, event.x, event.y));
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
      return;
    }
    pointerDown(event);
  };

  board.pointerMove = (event: PointerEvent) => {
    if (isPinching) {
      const point = toViewBoxPoint(board, toHostPoint(board, event.x, event.y));
      touchPoints[event.pointerId] = point;
      throttleRAF(board, 'pinch-zoom', () => {
        const points = Object.values(touchPoints);
        if (points.length === 2) {
          const currentDistance = distanceBetweenPointAndPoint(
            points[0][0],
            points[0][1],
            points[1][0],
            points[1][1]
          );
          const rawZoom = (currentDistance / initialDistance) * initialZoom;
          const smoothedZoom = calculateSmoothedZoom(
            rawZoom,
            board.viewport.zoom
          );
          const center = getMidPoint(points[0], points[1]);
          BoardTransforms.updateZoom(board, smoothedZoom, center);
        }
      });
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
