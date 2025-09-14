import { getSelectedElements, PlaitBoard } from '@plait/core';
import { base64ToBlob, boardToImage, download } from './common';
import { fileOpen } from '../data/filesystem';
import { IMAGE_MIME_TYPES } from '../constants';
import { insertImage } from '../data/image';

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

export const addImage = async (board: PlaitBoard) => {
  const imageFile = await fileOpen({
    description: 'Image',
    extensions: Object.keys(
      IMAGE_MIME_TYPES
    ) as (keyof typeof IMAGE_MIME_TYPES)[],
  });
  insertImage(board, imageFile);
};

export const saveAsSVG = (board: PlaitBoard) => {
  try {
    // Get the main SVG element from the board
    const hostSVG = PlaitBoard.getHost(board);
    if (!hostSVG) {
      console.error('Could not find board SVG element');
      return;
    }

    // Clone the SVG to avoid modifying the original
    const svgClone = hostSVG.cloneNode(true) as SVGSVGElement;
    
    // This ensures all visual elements including Mermaid diagrams are included
    
    // Get the current viewBox to ensure proper sizing
    const viewBox = svgClone.getAttribute('viewBox');
    if (!viewBox) {
      // Fallback: set viewBox based on SVG dimensions
      const rect = hostSVG.getBoundingClientRect();
      svgClone.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    }

    // Ensure SVG has proper namespace
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    // Get SVG as string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    
    // Create blob and download
    const blob = new Blob([svgString], { type: IMAGE_MIME_TYPES.svg });
    const svgName = `drawnix-${new Date().getTime()}.svg`;
    download(blob, svgName);
  } catch (error) {
    console.error('Error exporting SVG:', error);
  }
};
