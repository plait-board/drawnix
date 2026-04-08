import {
  PlaitBoard,
  PlaitElement,
  Point,
  throttleRAF,
  toHostPoint,
  toViewBoxPoint,
  Transforms,
} from '@plait/core';
import { isDrawingMode } from '@plait/common';
import { createFreehandElement } from './utils';
import { Freehand, FreehandShape } from './type';
import { CoreTransforms } from '@plait/core';
import { LaserPointer } from '../../utils/laser-pointer';
import { isTwoFingerMode } from '@plait-board/react-board';

interface EraserState {
  size: number;
  path: Point[];
}

const DEFAULT_ERASER_SIZE = 10;

const ERASER_SIZE_KEY = 'drawnix-eraser-size';

export const getEraserSize = (): number => {
  const savedSize = localStorage.getItem(ERASER_SIZE_KEY);
  if (savedSize) {
    const size = parseFloat(savedSize);
    if (!isNaN(size) && size >= 1 && size <= 50) {
      return size;
    }
  }
  return DEFAULT_ERASER_SIZE;
};

export const setEraserSize = (size: number): void => {
  localStorage.setItem(ERASER_SIZE_KEY, size.toString());
};

const distanceToLineSegment = (point: Point, p1: Point, p2: Point): number => {
  const [x, y] = point;
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

const isPointNearLineSegment = (point: Point, p1: Point, p2: Point, threshold: number): boolean => {
  return distanceToLineSegment(point, p1, p2) <= threshold;
};

const findIntersectionSegments = (
  points: Point[],
  eraserPath: Point[],
  eraserSize: number
): number[] => {
  const intersectionIndices: number[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    for (const eraserPoint of eraserPath) {
      if (isPointNearLineSegment(eraserPoint, p1, p2, eraserSize)) {
        if (!intersectionIndices.includes(i)) {
          intersectionIndices.push(i);
        }
        break;
      }
    }
  }

  return intersectionIndices.sort((a, b) => a - b);
};

const splitPointsAtIntersections = (
  points: Point[],
  intersectionIndices: number[]
): Point[][] => {
  if (intersectionIndices.length === 0) {
    return [points];
  }

  const segments: Point[][] = [];
  let startIndex = 0;

  for (let i = 0; i < intersectionIndices.length; i++) {
    const intersectionIndex = intersectionIndices[i];
    
    if (startIndex <= intersectionIndex) {
      const segment = points.slice(startIndex, intersectionIndex + 1);
      if (segment.length >= 2) {
        segments.push(segment);
      }
    }
    
    startIndex = intersectionIndex + 1;
  }

  if (startIndex < points.length) {
    const segment = points.slice(startIndex);
    if (segment.length >= 2) {
      segments.push(segment);
    }
  }

  return segments;
};

export const withFreehandErase = (board: PlaitBoard) => {
  const { pointerDown, pointerMove, pointerUp, globalPointerUp, touchStart } =
    board;

  const laserPointer = new LaserPointer();

  let isErasing = false;
  const eraserState: EraserState = {
    size: getEraserSize(),
    path: [],
  };

  const elementsToModify = new Map<string, { element: Freehand; intersectionIndices: number[] }>();

  const checkAndMarkFreehandElementsForModification = (point: Point) => {
    const viewBoxPoint = toViewBoxPoint(
      board,
      toHostPoint(board, point[0], point[1])
    );

    eraserState.path.push(viewBoxPoint);

    const freehandElements = board.children.filter((element) =>
      Freehand.isFreehand(element)
    ) as Freehand[];

    freehandElements.forEach((element) => {
      const intersectionIndices = findIntersectionSegments(
        element.points,
        [viewBoxPoint],
        eraserState.size
      );

      if (intersectionIndices.length > 0) {
        if (!elementsToModify.has(element.id)) {
          elementsToModify.set(element.id, {
            element,
            intersectionIndices: [],
          });
          PlaitElement.getElementG(element).style.opacity = '0.2';
        }

        const existingData = elementsToModify.get(element.id)!;
        intersectionIndices.forEach((index) => {
          if (!existingData.intersectionIndices.includes(index)) {
            existingData.intersectionIndices.push(index);
          }
        });
      }
    });
  };

  const modifyMarkedElements = () => {
    if (elementsToModify.size > 0) {
      const elementsToProcess = Array.from(elementsToModify.values());
      
      const elementsWithIndex = elementsToProcess.map(({ element, intersectionIndices }) => {
        const originalIndex = board.children.indexOf(element);
        return {
          element,
          intersectionIndices,
          originalIndex,
        };
      }).filter(item => item.originalIndex !== -1);

      elementsWithIndex.sort((a, b) => b.originalIndex - a.originalIndex);

      elementsWithIndex.forEach(({ element, intersectionIndices, originalIndex }) => {
        const segments = splitPointsAtIntersections(
          element.points,
          intersectionIndices.sort((a, b) => a - b)
        );

        CoreTransforms.removeElements(board, [element]);

        if (segments.length > 0) {
          for (let i = segments.length - 1; i >= 0; i--) {
            const newElement = createFreehandElement(element.shape, segments[i]);
            Transforms.insertNode(board, newElement, [originalIndex]);
          }
        }
      });
    }
  };

  const complete = () => {
    if (isErasing) {
      modifyMarkedElements();
      isErasing = false;
      elementsToModify.clear();
      eraserState.path = [];
      laserPointer.destroy();
    }
  };

  board.touchStart = (event: TouchEvent) => {
    const isEraserPointer = PlaitBoard.isInPointer(board, [
      FreehandShape.eraser,
    ]);
    if (isEraserPointer && isDrawingMode(board)) {
      return event.preventDefault();
    }
    touchStart(event);
  };

  board.pointerDown = (event: PointerEvent) => {
    const isEraserPointer = PlaitBoard.isInPointer(board, [
      FreehandShape.eraser,
    ]);

    if (isEraserPointer && isDrawingMode(board)) {
      isErasing = true;
      elementsToModify.clear();
      eraserState.path = [];
      eraserState.size = getEraserSize();
      const currentPoint: Point = [event.x, event.y];
      checkAndMarkFreehandElementsForModification(currentPoint);
      laserPointer.init(board);
      return;
    }

    pointerDown(event);
  };

  board.pointerMove = (event: PointerEvent) => {
    if (isErasing && !isTwoFingerMode(board)) {
      throttleRAF(board, 'with-freehand-erase', () => {
        const currentPoint: Point = [event.x, event.y];
        checkAndMarkFreehandElementsForModification(currentPoint);
      });
      return;
    }
    if (isErasing && isTwoFingerMode(board)) {
      complete();
      return;
    }
    pointerMove(event);
  };

  board.pointerUp = (event: PointerEvent) => {
    if (isErasing) {
      complete();
      return;
    }

    pointerUp(event);
  };

  board.globalPointerUp = (event: PointerEvent) => {
    if (isErasing) {
      complete();
      return;
    }

    globalPointerUp(event);
  };

  return board;
};
