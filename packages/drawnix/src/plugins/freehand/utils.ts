import {
  getSelectedElements,
  idCreator,
  isPointInPolygon,
  PlaitBoard,
  Point,
  RectangleClient,
  rotateAntiPointsByElement,
  Selection,
} from '@plait/core';
import { DefaultFreehand, Freehand, FreehandShape } from './type';
import {
  isClosedPoints,
  isHitPolyLine,
  isRectangleHitRotatedPoints,
} from '@plait/draw';

export function getFreehandPointers() {
  return [FreehandShape.feltTipPen];
}

export const createFreehandElement = (
  shape: FreehandShape,
  points: Point[]
): Freehand => {
  const element: Freehand = {
    id: idCreator(),
    type: 'freehand',
    shape,
    points,
    strokeWidth: DefaultFreehand.strokeWidth,
    strokeColor: DefaultFreehand.strokeColor,
  };
  return element;
};

export const isHitFreehand = (
  board: PlaitBoard,
  element: Freehand,
  point: Point
) => {
  const antiPoint = rotateAntiPointsByElement(point, element) || point;
  const points = element.points;
  if (isClosedPoints(element.points)) {
    return (
      isPointInPolygon(antiPoint, points) || isHitPolyLine(points, antiPoint)
    );
  } else {
    return isHitPolyLine(points, antiPoint);
  }
};

export const isRectangleHitFreehand = (
  board: PlaitBoard,
  element: Freehand,
  selection: Selection
) => {
  const rangeRectangle = RectangleClient.getRectangleByPoints([
    selection.anchor,
    selection.focus,
  ]);
  return isRectangleHitRotatedPoints(
    rangeRectangle,
    element.points,
    element.angle
  );
};

export const getSelectedFreehandElements = (board: PlaitBoard) => {
  return getSelectedElements(board).filter((ele) => Freehand.isFreehand(ele));
};
