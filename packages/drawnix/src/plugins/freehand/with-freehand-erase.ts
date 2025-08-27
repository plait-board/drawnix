import {
    PlaitBoard,
    PlaitElement,
    Point,
    throttleRAF,
    toHostPoint,
    toViewBoxPoint,
} from '@plait/core';
import { isDrawingMode } from '@plait/common';
import { isHitFreehand } from './utils';
import { Freehand, FreehandShape } from './type';
import { CoreTransforms } from '@plait/core';

export const withFreehandErase = (board: PlaitBoard) => {
    const { pointerDown, pointerMove, pointerUp, globalPointerUp } = board;

    let isErasing = false;
    const elementsToDelete = new Set<string>();

    const checkAndMarkFreehandElementsForDeletion = (point: Point) => {
        const viewBoxPoint = toViewBoxPoint(board, toHostPoint(board, point[0], point[1]));

        const freehandElements = board.children.filter((element) =>
            Freehand.isFreehand(element)
        ) as Freehand[];

        freehandElements.forEach((element) => {
            if (!elementsToDelete.has(element.id) && isHitFreehand(board, element, viewBoxPoint)) {
                PlaitElement.getElementG(element).style.opacity = '0.2';
                elementsToDelete.add(element.id);
            }
        });
    };

    const deleteMarkedElements = () => {
        if (elementsToDelete.size > 0) {
            const elementsToRemove = board.children.filter((element) =>
                elementsToDelete.has(element.id)
            );
            
            if (elementsToRemove.length > 0) {
                CoreTransforms.removeElements(board, elementsToRemove);
            }
        }
    };

    const complete = () => {
        if (isErasing) {
            deleteMarkedElements();
            isErasing = false;
            elementsToDelete.clear();
        }
    };

    board.pointerDown = (event: PointerEvent) => {
        const isEraserPointer = PlaitBoard.isInPointer(board, [FreehandShape.eraser]);

        if (isEraserPointer && isDrawingMode(board)) {
            isErasing = true;
            elementsToDelete.clear();
            const currentPoint: Point = [event.x, event.y];
            checkAndMarkFreehandElementsForDeletion(currentPoint);
            return;
        }

        pointerDown(event);
    };

    board.pointerMove = (event: PointerEvent) => {
        if (isErasing) {
            throttleRAF(board, 'with-freehand-erase', () => {
                const currentPoint: Point = [event.x, event.y];
                checkAndMarkFreehandElementsForDeletion(currentPoint);
            });
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