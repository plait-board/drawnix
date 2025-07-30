import {
  getElementOfFocusedImage,
  isResizing,
  type PlaitImageBoard,
} from '@plait/common';
import {
  ClipboardData,
  getHitElementByPoint,
  isDragging,
  isSelectionMoving,
  PlaitBoard,
  Point,
  toHostPoint,
  toViewBoxPoint,
  WritableClipboardOperationType,
} from '@plait/core';
import { isSupportedImageFileType } from '../data/blob';
import { insertImage } from '../data/image';
import { isHitImage, MindElement, ImageData } from '@plait/mind';
import { ImageViewer } from '../libs/image-viewer';

export const withImagePlugin = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard & PlaitImageBoard;
  const { insertFragment, drop, pointerUp } = newBoard;
  const viewer = new ImageViewer({
    zoomStep: 0.3,
    minZoom: 0.1,
    maxZoom: 5,
    enableKeyboard: true,
  });

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

  newBoard.pointerUp = (event: PointerEvent) => {
    const focusMindNode = getElementOfFocusedImage(board);
    if (
      focusMindNode &&
      !isResizing(board) &&
      !isSelectionMoving(board) &&
      !isDragging(board)
    ) {
      const point = toViewBoxPoint(board, toHostPoint(board, event.x, event.y));
      const hitElement = getHitElementByPoint(board, point);
      const isHittingImage =
        hitElement &&
        MindElement.isMindElement(board, hitElement) &&
        MindElement.hasImage(hitElement) &&
        isHitImage(board, hitElement as MindElement<ImageData>, point);
      if (isHittingImage && focusMindNode === hitElement) {
        viewer.open(hitElement.data.image.url);
      }
    }
    pointerUp(event);
  };

  return newBoard;
};
