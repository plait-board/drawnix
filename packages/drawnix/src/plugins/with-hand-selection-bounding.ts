import {
  getSelectedElements,
  PlaitBoard,
  PlaitOperation,
  PlaitPointerType,
  SELECTION_RECTANGLE_BOUNDING_CLASS_NAME,
  updateViewportContainerScroll,
} from '@plait/core';

export const HAND_SELECTION_BOUNDING_CLASS_NAME = 'drawnix-hand-selection-bounding';
const VIEWPORT_MOVING_CLASS_NAME = 'viewport-moving';

export const clearHandSelectionBounding = (board: PlaitBoard) => {
  const activeHost = PlaitBoard.getActiveHost(board);
  activeHost
    .querySelectorAll(`.${HAND_SELECTION_BOUNDING_CLASS_NAME}`)
    .forEach((element) => element.remove());
};

export const refreshSelectionBounding = (board: PlaitBoard) => {
  const activeHost = PlaitBoard.getActiveHost(board);
  activeHost
    .querySelectorAll(`.${SELECTION_RECTANGLE_BOUNDING_CLASS_NAME}`)
    .forEach((element) => element.remove());

  if (getSelectedElements(board).length > 1) {
    const selectionRectangle = board.drawSelectionRectangle();
    if (selectionRectangle) {
      selectionRectangle.classList.add(HAND_SELECTION_BOUNDING_CLASS_NAME);
      activeHost.append(selectionRectangle);
    }
  }
};

export const withHandSelectionBounding = (board: PlaitBoard) => {
  const { afterChange, onChange, pointerDown, pointerMove, pointerUp, globalPointerUp } = board;
  let temporaryViewportMovingPoint: { x: number; y: number } | null = null;

  const isTemporaryViewportMove = () => {
    return (
      board.pointer !== PlaitPointerType.hand &&
      PlaitBoard.getBoardContainer(board).classList.contains(VIEWPORT_MOVING_CLASS_NAME)
    );
  };

  const moveTemporaryViewport = (event: PointerEvent) => {
    if (!temporaryViewportMovingPoint) {
      return;
    }
    const viewportContainer = PlaitBoard.getViewportContainer(board);
    const left = viewportContainer.scrollLeft - (event.x - temporaryViewportMovingPoint.x);
    const top = viewportContainer.scrollTop - (event.y - temporaryViewportMovingPoint.y);
    updateViewportContainerScroll(board, left, top, false);
    temporaryViewportMovingPoint = { x: event.x, y: event.y };
  };

  const clearIfNotHand = () => {
    if (board.pointer !== PlaitPointerType.hand) {
      clearHandSelectionBounding(board);
    }
  };

  board.pointerDown = (event) => {
    clearIfNotHand();
    if (isTemporaryViewportMove()) {
      temporaryViewportMovingPoint = { x: event.x, y: event.y };
      event.preventDefault();
      return;
    }
    pointerDown(event);
  };

  board.pointerMove = (event) => {
    if (temporaryViewportMovingPoint) {
      if (isTemporaryViewportMove()) {
        moveTemporaryViewport(event);
        event.preventDefault();
      } else {
        temporaryViewportMovingPoint = null;
      }
      return;
    }
    pointerMove(event);
  };

  board.pointerUp = (event) => {
    if (temporaryViewportMovingPoint) {
      temporaryViewportMovingPoint = null;
      event.preventDefault();
      return;
    }
    pointerUp(event);
  };

  board.globalPointerUp = (event) => {
    if (temporaryViewportMovingPoint) {
      temporaryViewportMovingPoint = null;
      event.preventDefault();
      return;
    }
    globalPointerUp(event);
  };

  board.onChange = () => {
    clearIfNotHand();
    onChange();
  };

  board.afterChange = () => {
    afterChange();
    const hasViewportChanged = board.operations.some((operation) =>
      PlaitOperation.isSetViewportOperation(operation)
    );
    if (board.pointer === PlaitPointerType.hand && hasViewportChanged) {
      refreshSelectionBounding(board);
      return;
    }
    clearIfNotHand();
  };

  return board;
};
