import {
  PlaitBoard,
  Point,
  Transforms,
  distanceBetweenPointAndPoint,
  throttleRAF,
  toHostPoint,
  toViewBoxPoint,
} from '@plait/core';
import { isDrawingMode } from '@plait/common';
import { createFreehandElement, getFreehandPointers } from './utils';
import { Freehand, FreehandShape } from './type';
import { FreehandGenerator } from './freehand.generator';
import { FreehandSmoother } from './smoother';

export const withFreehandCreate = (board: PlaitBoard) => {
  const { pointerDown, pointerMove, pointerUp, globalPointerUp } = board;

  let isDrawing = false;

  let points: Point[] = [];

  const generator = new FreehandGenerator(board);

  const smoother = new FreehandSmoother();

  let temporaryElement: Freehand | null = null;

  let previousScreenPoint: Point | null = null;

  const complete = (cancel?: boolean) => {
    if (isDrawing) {
      const pointer = PlaitBoard.getPointer(board) as FreehandShape;
      temporaryElement = createFreehandElement(pointer, points);
    }
    if (temporaryElement && !cancel) {
      Transforms.insertNode(board, temporaryElement, [board.children.length]);
    }
    generator?.destroy();
    temporaryElement = null;
    isDrawing = false;
    points = [];
    previousScreenPoint = null;
    smoother.reset();
  };

  board.pointerDown = (event: PointerEvent) => {
    const freehandPointers = getFreehandPointers();
    const isFreehandPointer = PlaitBoard.isInPointer(board, freehandPointers);
    if (isFreehandPointer && isDrawingMode(board)) {
      isDrawing = true;
      const originPoint: Point = [event.x, event.y];
      const smoothingPoint = smoother.smoothPoint(originPoint);
      const point = toViewBoxPoint(
        board,
        toHostPoint(board, smoothingPoint[0], smoothingPoint[1])
      );
      points.push(point);
      previousScreenPoint = smoothingPoint;
    }
    pointerDown(event);
  };

  board.pointerMove = (event: PointerEvent) => {
    if (isDrawing && previousScreenPoint) {
      const originPoint: Point = [event.x, event.y];
      const smoothingPoint = smoother.smoothPoint(originPoint);
      const distance = distanceBetweenPointAndPoint(
        previousScreenPoint[0],
        previousScreenPoint[1],
        smoothingPoint[0],
        smoothingPoint[1]
      );
      if (distance <= 0.5) {
        return;
      }
      previousScreenPoint = smoothingPoint;
      generator?.destroy();
      const newPoint = toViewBoxPoint(
        board,
        toHostPoint(board, smoothingPoint[0], smoothingPoint[1])
      );
      points.push(newPoint);
      const pointer = PlaitBoard.getPointer(board) as FreehandShape;
      temporaryElement = createFreehandElement(pointer, points);
      generator.processDrawing(
        temporaryElement,
        PlaitBoard.getElementActiveHost(board)
      );
      return;
    }

    pointerMove(event);
  };

  board.pointerUp = (event: PointerEvent) => {
    complete();
    pointerUp(event);
  };

  board.globalPointerUp = (event: PointerEvent) => {
    complete(true);
    globalPointerUp(event);
  };

  return board;
};
