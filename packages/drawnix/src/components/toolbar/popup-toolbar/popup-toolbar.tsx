import Stack from '../../stack';
import { FontColorIcon } from '../../icons';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  getRectangleByElements,
  getSelectedElements,
  isDragging,
  isMovingElements,
  isSelectionMoving,
  PlaitBoard,
  PlaitElement,
  RectangleClient,
  toHostPointFromViewBoxPoint,
  toScreenPointFromHostPoint,
} from '@plait/core';
import { useEffect, useRef, useState } from 'react';
import { useBoard } from '@plait/react-board';
import { flip, offset, useFloating } from '@floating-ui/react';
import { Island } from '../../island';
import classNames from 'classnames';
import {
  getStrokeColorByElement as getStrokeColorByMindElement,
  MindElement,
} from '@plait/mind';
import './popup-toolbar.scss';
import {
  getStrokeColorByElement as getStrokeColorByDrawElement,
  isClosedCustomGeometry,
  isClosedDrawElement,
  isDrawElementsIncludeText,
  PlaitDrawElement,
} from '@plait/draw';
import { CustomText } from '@plait/common';
import { getTextMarksByElement } from '@plait/text-plugins';
import { PopupFontColorButton } from './font-color-button';
import { PopupStrokeButton } from './stroke-button';
import { PopupFillButton } from './fill-button';
import { isWhite, removeHexAlpha } from '../../../utils/color';
import { NO_COLOR } from '../../../constants/color';
import { Freehand } from '../../../plugins/freehand/type';

export const PopupToolbar = () => {
  const board = useBoard();
  const selectedElements = getSelectedElements(board);
  const [movingOrDragging, setMovingOrDragging] = useState(false);
  const movingOrDraggingRef = useRef(movingOrDragging);
  const open = selectedElements.length > 0 && !isSelectionMoving(board);
  const { viewport, selection, children } = board;
  const { refs, floatingStyles } = useFloating({
    placement: 'right-start',
    middleware: [offset(32), flip()],
  });
  let state: {
    fill: string | undefined;
    strokeColor?: string;
    hasFill?: boolean;
    fontColor?: string;
    hasFontColor?: boolean;
    hasStroke?: boolean;
    hasStrokeStyle?: boolean;
    marks?: Omit<CustomText, 'text'>;
  } = {
    fill: 'red',
  };
  if (open && !movingOrDragging) {
    const hasFill =
      selectedElements.some((value) => hasFillProperty(board, value)) &&
      !PlaitBoard.hasBeenTextEditing(board);
    const hasText = selectedElements.some((value) =>
      hasTextProperty(board, value)
    );
    const hasStroke =
      selectedElements.some((value) => hasStrokeProperty(board, value)) &&
      !PlaitBoard.hasBeenTextEditing(board);
    const hasStrokeStyle =
      selectedElements.some((value) => hasStrokeStyleProperty(board, value)) &&
      !PlaitBoard.hasBeenTextEditing(board);
    state = {
      ...getElementState(board),
      hasFill,
      hasFontColor: hasText,
      hasStroke,
      hasStrokeStyle,
    };
  }
  useEffect(() => {
    if (open) {
      const hasSelected = selectedElements.length > 0;
      if (!movingOrDragging && hasSelected) {
        const elements = getSelectedElements(board);
        const rectangle = getRectangleByElements(board, elements, false);
        const [start, end] = RectangleClient.getPoints(rectangle);
        const screenStart = toScreenPointFromHostPoint(
          board,
          toHostPointFromViewBoxPoint(board, start)
        );
        const screenEnd = toScreenPointFromHostPoint(
          board,
          toHostPointFromViewBoxPoint(board, end)
        );
        const width = screenEnd[0] - screenStart[0];
        const height = screenEnd[1] - screenStart[1];
        refs.setPositionReference({
          getBoundingClientRect() {
            return {
              width,
              height,
              x: screenStart[0],
              y: screenStart[1],
              top: screenStart[1],
              left: screenStart[0],
              right: screenStart[0] + width,
              bottom: screenStart[1] + height,
            };
          },
        });
      }
    }
  }, [viewport, selection, children, movingOrDragging]);

  useEffect(() => {
    movingOrDraggingRef.current = movingOrDragging;
  }, [movingOrDragging]);

  useEffect(() => {
    const { pointerUp, pointerMove } = board;

    board.pointerMove = (event: PointerEvent) => {
      if (
        (isMovingElements(board) || isDragging(board)) &&
        !movingOrDraggingRef.current
      ) {
        setMovingOrDragging(true);
      }
      pointerMove(event);
    };

    board.pointerUp = (event: PointerEvent) => {
      if (
        movingOrDraggingRef.current &&
        (isMovingElements(board) || isDragging(board))
      ) {
        setMovingOrDragging(false);
      }
      pointerUp(event);
    };

    return () => {
      board.pointerUp = pointerUp;
      board.pointerMove = pointerMove;
    };
  }, [board]);

  return (
    <>
      {open && !movingOrDragging && (
        <Island
          padding={1}
          className={classNames('popup-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
          ref={refs.setFloating}
          style={floatingStyles}
        >
          <Stack.Row gap={1}>
            {state.hasFontColor && (
              <PopupFontColorButton
                board={board}
                key={0}
                currentColor={state.marks?.color}
                title={`Font Color`}
                fontColorIcon={
                  <FontColorIcon currentColor={state.marks?.color} />
                }
              ></PopupFontColorButton>
            )}
            {state.hasStroke && (
              <PopupStrokeButton
                board={board}
                key={1}
                currentColor={state.strokeColor}
                title={`Stroke`}
                hasStrokeStyle={state.hasStrokeStyle || false}
              >
                <label
                  className={classNames('stroke-label', 'color-label')}
                  style={{ borderColor: state.strokeColor }}
                ></label>
              </PopupStrokeButton>
            )}
            {state.hasFill && (
              <PopupFillButton
                board={board}
                key={2}
                currentColor={state.fill}
                title={`Fill Color`}
              >
                <label
                  className={classNames('fill-label', 'color-label', {
                    'color-white':
                      state.fill && isWhite(removeHexAlpha(state.fill)),
                  })}
                  style={{ backgroundColor: state.fill }}
                ></label>
              </PopupFillButton>
            )}
          </Stack.Row>
        </Island>
      )}
    </>
  );
};

export const getMindElementState = (
  board: PlaitBoard,
  element: MindElement
) => {
  const marks = getTextMarksByElement(element);
  return {
    fill: element.fill,
    strokeColor: getStrokeColorByMindElement(board, element),
    marks,
  };
};

export const getDrawElementState = (
  board: PlaitBoard,
  element: PlaitDrawElement
) => {
  const marks: Omit<CustomText, 'text'> = getTextMarksByElement(element);
  return {
    fill: element.fill,
    strokeColor: getStrokeColorByDrawElement(board, element),
    marks,
  };
};

export const getElementState = (board: PlaitBoard) => {
  const selectedElement = getSelectedElements(board)[0];
  if (MindElement.isMindElement(board, selectedElement)) {
    return getMindElementState(board, selectedElement);
  }
  return getDrawElementState(board, selectedElement as PlaitDrawElement);
};

export const hasFillProperty = (board: PlaitBoard, element: PlaitElement) => {
  if (MindElement.isMindElement(board, element)) {
    return true;
  }
  if (isClosedCustomGeometry(board, element)) {
    return true;
  }
  if (PlaitDrawElement.isDrawElement(element)) {
    return (
      PlaitDrawElement.isShapeElement(element) &&
      !PlaitDrawElement.isImage(element) &&
      !PlaitDrawElement.isText(element) &&
      isClosedDrawElement(element)
    );
  }
  return false;
};

export const hasStrokeProperty = (board: PlaitBoard, element: PlaitElement) => {
  if (MindElement.isMindElement(board, element)) {
    return true;
  }
  if (Freehand.isFreehand(element)) {
    return true;
  }
  if (PlaitDrawElement.isDrawElement(element)) {
    return (
      (PlaitDrawElement.isShapeElement(element) &&
        !PlaitDrawElement.isImage(element) &&
        !PlaitDrawElement.isText(element)) ||
      PlaitDrawElement.isArrowLine(element) ||
      PlaitDrawElement.isVectorLine(element) ||
      PlaitDrawElement.isTable(element)
    );
  }
  return false;
};

export const hasStrokeStyleProperty = (
  board: PlaitBoard,
  element: PlaitElement
) => {
  return hasStrokeProperty(board, element);
};

export const hasTextProperty = (board: PlaitBoard, element: PlaitElement) => {
  if (MindElement.isMindElement(board, element)) {
    return true;
  }
  if (PlaitDrawElement.isDrawElement(element)) {
    return isDrawElementsIncludeText([element]);
  }
  return false;
};

export const getColorPropertyValue = (color: string) => {
  if (color === NO_COLOR) {
    return null;
  } else {
    return color;
  }
};
