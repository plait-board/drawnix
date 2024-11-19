import { getSelectedElements, PlaitBoard } from '@plait/core';
import { base64ToBlob, boardToImage, download } from './common';

export const saveAsPNG = (board: PlaitBoard) => {
  const selectedElements = getSelectedElements(board);
  boardToImage(board, {
    elements: selectedElements.length > 0 ? selectedElements : undefined,
  }).then((image) => {
    if (image) {
      const pngImage = base64ToBlob(image);
      const imageName = `drawnix-${new Date().getTime()}.png`;
      download(pngImage, imageName);
    }
  });
};
