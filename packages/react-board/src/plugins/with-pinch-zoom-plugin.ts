import {
  BoardTransforms,
  distanceBetweenPointAndPoint,
  getPointBetween,
  getViewportOrigination,
  MAX_ZOOM,
  MIN_ZOOM,
  PlaitBoard,
  Point,
} from '@plait/core';

interface PointerRecord {
  pointerId: number;
  lastPoint: Point;
  currentPoint: Point;
  hasMoved: boolean;
}

export const TOUCH_RECORDS = new WeakMap<PlaitBoard, PointerRecord[]>();

export const isTwoFingerMode = (board: PlaitBoard) => {
  const pointerRecords = TOUCH_RECORDS.get(board);
  return pointerRecords?.length === 2;
};

export const withPinchZoom = (board: PlaitBoard) => {
  const { touchStart, touchMove, touchEnd } = board;

  let pointerRecords: PointerRecord[] = [];
  let initializeZoom = 0;
  let isPinching = false;

  board.touchStart = (event: TouchEvent) => {
    pointerRecords = Array.from(event.touches).map((touch) => ({
      pointerId: touch.identifier,
      lastPoint: [touch.clientX, touch.clientY],
      currentPoint: [touch.clientX, touch.clientY],
      hasMoved: false,
    }));
    TOUCH_RECORDS.set(board, pointerRecords);
    if (pointerRecords.length >= 2) {
      initializeZoom = board.viewport.zoom;
    }
    touchStart(event);
  };

  board.touchMove = (event: TouchEvent) => {
    Array.from(event.changedTouches).forEach((touch) => {
      const record = pointerRecords.find(
        (record) => record.pointerId === touch.identifier
      );
      if (record) {
        record.lastPoint = record.currentPoint;
        record.currentPoint = [touch.clientX, touch.clientY];
        record.hasMoved = true;
      }
    });
    if (pointerRecords.length === 2) {
      event.preventDefault();
    }
    if (
      pointerRecords.length === 2 &&
      pointerRecords.every((record) => record.hasMoved)
    ) {
      const [p1, p2] = pointerRecords;
      const pinchCenter = getPointBetween(
        ...p1.lastPoint,
        ...p2.lastPoint
      ) as Point;
      const newPinchCenter = getPointBetween(
        ...p1.currentPoint,
        ...p2.currentPoint
      ) as Point;
      const dx = newPinchCenter[0] - pinchCenter[0];
      const dy = newPinchCenter[1] - pinchCenter[1];

      // hand moving
      const boardContainerRect =
        PlaitBoard.getBoardContainer(board).getBoundingClientRect();
      const halfOfWidth = boardContainerRect.width / 2;
      const halfOfHeight = boardContainerRect.height / 2;
      const zoom = board.viewport.zoom;
      const origination = getViewportOrigination(board);
      let centerX = origination![0] + halfOfWidth / zoom - dx / zoom;
      let centerY = origination![1] + halfOfHeight / zoom - dy / zoom;
      let newOrigination = [
        centerX - boardContainerRect.width / 2 / zoom,
        centerY - boardContainerRect.height / 2 / zoom,
      ] as Point;

      let newZoom = zoom;
      const lastDistance = distanceBetweenPointAndPoint(
        ...p1.lastPoint,
        ...p2.lastPoint
      );
      const currentDistance = distanceBetweenPointAndPoint(
        ...p1.currentPoint,
        ...p2.currentPoint
      );
      // zoom 处理
      const scale = currentDistance / lastDistance;

      const v1 = [
        p1.currentPoint[0] - p1.lastPoint[0],
        p1.currentPoint[1] - p1.lastPoint[1],
      ] as Point;
      const v2 = [
        p2.currentPoint[0] - p2.lastPoint[0],
        p2.currentPoint[1] - p2.lastPoint[1],
      ] as Point;

      const dotProduct = v1[0] * v2[0] + v1[1] * v2[1];
      const v1Magnitude = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
      const v2Magnitude = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);

      const cosTheta = dotProduct / (v1Magnitude * v2Magnitude || 1);

      // 控制缩放
      // 基于余弦相似度（Cosine Similarity）
      // 余弦值 > 0.8：判定为平移手势（向量基本同向）
      // 余弦值 < -0.7：判定为缩放手势（向量基本反向）
      // 其他情况：未知手势
      if (cosTheta < -0.7 || (cosTheta <= 0.8 && isPinching && scale >= 0.01)) {
        isPinching = true;
      } else {
        isPinching = false;
      }
      if (isPinching) {
        newZoom = Math.min(
          Math.max(board.viewport.zoom * scale, MIN_ZOOM),
          MAX_ZOOM
        );
        const nativeElement = PlaitBoard.getBoardContainer(board);
        const nativeElementRect = nativeElement.getBoundingClientRect();
        const zoomCenterWidth = newPinchCenter[0] - nativeElementRect.x;
        const zoomCenterHeight = newPinchCenter[1] - nativeElementRect.y;
        centerX = newOrigination[0] + zoomCenterWidth / zoom;
        centerY = newOrigination[1] + zoomCenterHeight / zoom;
        newOrigination = [
          centerX - zoomCenterWidth / newZoom,
          centerY - zoomCenterHeight / newZoom,
        ] as Point;
      }
      BoardTransforms.updateViewport(board, newOrigination, newZoom);
      pointerRecords[0].lastPoint = p1.currentPoint;
      pointerRecords[1].lastPoint = p2.currentPoint;
      pointerRecords[0].hasMoved = false;
      pointerRecords[1].hasMoved = false;
      return;
    }
    touchMove(event);
  };

  board.touchEnd = (event: TouchEvent) => {
    const index = pointerRecords.findIndex(
      (r) => r.pointerId === event.changedTouches[0].identifier
    );
    if (index !== -1) {
      pointerRecords.splice(index, 1);
    }
    TOUCH_RECORDS.set(board, pointerRecords);
    touchEnd(event);
  };

  return board;
};
