import {
  getSelectedElements,
  PlaitBoard,
  PlaitOperation,
  PlaitPointerType,
  SELECTION_RECTANGLE_BOUNDING_CLASS_NAME,
} from '@plait/core';

export const HAND_SELECTION_BOUNDING_CLASS_NAME = 'drawnix-hand-selection-bounding';

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
  const { afterChange, onChange, pointerDown } = board;

  const clearIfNotHand = () => {
    if (board.pointer !== PlaitPointerType.hand) {
      clearHandSelectionBounding(board);
    }
  };

  board.pointerDown = (event) => {
    clearIfNotHand();
    pointerDown(event);
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
