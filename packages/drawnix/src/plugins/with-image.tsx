import { type PlaitImageBoard } from '@plait/common';
import {
  ClipboardData,
  PlaitBoard,
  Point,
  WritableClipboardOperationType,
} from '@plait/core';
import { isSupportedImageFileType } from '../data/blob';
import { insertImage } from '../data/image';

export const withImagePlugin = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard & PlaitImageBoard;
  const { insertFragment } = newBoard;

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
      insertImage(board, imageFile);
      return;
    }
    insertFragment(clipboardData, targetPoint, operationType);
  };

  return board;
};
