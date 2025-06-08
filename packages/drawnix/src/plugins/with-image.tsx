import { type PlaitImageBoard } from '@plait/common';
import {
  ClipboardData,
  PlaitBoard,
  Point,
  toHostPoint,
  toViewBoxPoint,
  WritableClipboardOperationType,
} from '@plait/core';
import { isSupportedImageFileType } from '../data/blob';
import { insertImage } from '../data/image';

export const withImagePlugin = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard & PlaitImageBoard;
  const { insertFragment, drop } = newBoard;

  newBoard.insertFragment = (
    clipboardData: ClipboardData | null,
    targetPoint: Point,
    operationType?: WritableClipboardOperationType
  ) => {
    if (
      clipboardData?.files?.length &&
      isSupportedImageFileType(clipboardData.files[0].type)
    ) {
      const imageFile = clipboardData.files[0];
      insertImage(board, imageFile, targetPoint, false);
      return;
    }
    insertFragment(clipboardData, targetPoint, operationType);
  };

  newBoard.drop = (event: DragEvent) => {
    if (event.dataTransfer?.files?.length) {
      const imageFile = event.dataTransfer.files[0];
      if (isSupportedImageFileType(imageFile.type)) {
        const point = toViewBoxPoint(
          board,
          toHostPoint(board, event.x, event.y)
        );
        insertImage(board, imageFile, point, true);
        return true;
      }
    }
    return drop(event);
  };

  return newBoard;
};
