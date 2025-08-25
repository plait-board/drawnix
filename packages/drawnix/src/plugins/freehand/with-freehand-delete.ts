import {
    PlaitBoard,
    Point,
    Transforms,
    toHostPoint,
    toViewBoxPoint,
} from '@plait/core';
import { isDrawingMode } from '@plait/common';
import { getFreehandPointers, isHitFreehand } from './utils';
import { Freehand, FreehandShape } from './type';

export const withFreehandDelete = (board: PlaitBoard) => {
const { pointerDown, pointerMove, pointerUp, globalPointerUp } = board;

let isErasing = false;
let deletedElements = new Set<string>();

const checkAndDeleteFreehandElements = (point: Point) => {
    const viewBoxPoint = toViewBoxPoint(board, toHostPoint(board, point[0], point[1]));
    
    const freehandElements = board.children.filter((element) => 
    Freehand.isFreehand(element)
    ) as Freehand[];

    freehandElements.forEach((element) => {
    if (!deletedElements.has(element.id) && isHitFreehand(board, element, viewBoxPoint)) {
        deletedElements.add(element.id);
        const elementIndex = board.children.findIndex(child => child.id === element.id);
        if (elementIndex !== -1) {
        Transforms.removeNode(board, [elementIndex]);
        }
    }
    });
};

const complete = () => {
    isErasing = false;
    deletedElements.clear();
};

board.pointerDown = (event: PointerEvent) => {
    const freehandPointers = getFreehandPointers();
    const isEraserPointer = PlaitBoard.isInPointer(board, [FreehandShape.eraser]);
    
    if (isEraserPointer && isDrawingMode(board)) {
    isErasing = true;
    const currentPoint: Point = [event.x, event.y];
    checkAndDeleteFreehandElements(currentPoint);
    return;
    }

    pointerDown(event);
};

board.pointerMove = (event: PointerEvent) => {
    if (isErasing) {
    const currentPoint: Point = [event.x, event.y];
    checkAndDeleteFreehandElements(currentPoint);
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