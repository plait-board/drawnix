import { getSelectedElements, PlaitBoard } from '@plait/core';
import { base64ToBlob, boardToImage, download } from './common';

export const saveAsImage = (board: PlaitBoard, isTransparent: boolean) => {
  const selectedElements = getSelectedElements(board);
  boardToImage(board, {
    elements: selectedElements.length > 0 ? selectedElements : undefined,
    fillStyle: isTransparent ? 'transparent' : 'white',
  }).then((image) => {
    if (image) {
      const ext = isTransparent ? 'png' : 'jpg';
      const pngImage = base64ToBlob(image);
      const imageName = `drawnix-${new Date().getTime()}.${ext}`;
      download(pngImage, imageName);
    }
  });
};
