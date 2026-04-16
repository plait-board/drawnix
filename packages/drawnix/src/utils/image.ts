import { getSelectedElements, PlaitBoard, toSvgData } from '@plait/core';
import { base64ToBlob, boardToImage, download } from './common';
import { fileOpen } from '../data/filesystem';
import { IMAGE_MIME_TYPES } from '../constants';
import { insertImage } from '../data/image';
import { getBackgroundColor, isWhite } from './color';
import { TRANSPARENT } from '../constants/color';

type ClipboardImageFormat = 'svg' | 'png' | 'jpg';

const CLIPBOARD_MIME_TYPES: Record<ClipboardImageFormat, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
};

const getSelectedClipboardElements = (board: PlaitBoard) => {
  const selectedElements = getSelectedElements(board);
  return selectedElements.length > 0 ? selectedElements : null;
};

const hasClipboardWriteSupport = () => {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.clipboard?.write &&
    typeof ClipboardItem !== 'undefined'
  );
};

const getClipboardItemSupports = () => {
  const clipboardItemWithSupports = ClipboardItem as typeof ClipboardItem & {
    supports?: (type: string) => boolean;
  };
  return clipboardItemWithSupports.supports;
};

export const canCopySelectionAs = (format: ClipboardImageFormat) => {
  if (!hasClipboardWriteSupport()) {
    return false;
  }
  // jpg is written as png with opaque background since clipboard doesn't support image/jpeg
  const effectiveFormat = format === 'jpg' ? 'png' : format;
  const supports = getClipboardItemSupports();
  if (typeof supports === 'function') {
    return supports(CLIPBOARD_MIME_TYPES[effectiveFormat]);
  }
  return effectiveFormat === 'png';
};

const writeBlobToClipboard = async (
  format: ClipboardImageFormat,
  blob: Blob | null,
  fallbackPngBlob?: Blob | null
) => {
  if (!blob || !hasClipboardWriteSupport()) {
    return;
  }
  const item: Record<string, Blob> = { [CLIPBOARD_MIME_TYPES[format]]: blob };
  if (fallbackPngBlob) {
    item[CLIPBOARD_MIME_TYPES.png] = fallbackPngBlob;
  }
  await navigator.clipboard.write([new ClipboardItem(item)]);
};

const getSelectedSvgBlob = async (board: PlaitBoard) => {
  const selectedElements = getSelectedClipboardElements(board);
  if (!selectedElements) {
    return null;
  }
  const backgroundColor = getBackgroundColor(board);
  const svgData = await toSvgData(board, {
    fillStyle: isWhite(backgroundColor) ? TRANSPARENT : backgroundColor,
    padding: 20,
    ratio: 4,
    elements: selectedElements,
    inlineStyleClassNames: '.plait-text-container',
    styleNames: ['position'],
  });
  return new Blob([svgData], { type: CLIPBOARD_MIME_TYPES.svg });
};

const getSelectedImageDataUrl = async (
  board: PlaitBoard,
  isTransparent: boolean
) => {
  const selectedElements = getSelectedClipboardElements(board);
  if (!selectedElements) {
    return null;
  }
  const backgroundColor = getBackgroundColor(board) || 'white';
  return boardToImage(board, {
    elements: selectedElements,
    fillStyle: isTransparent ? 'transparent' : backgroundColor,
  });
};

export const saveAsSvg = (board: PlaitBoard) => {
  const selectedElements = getSelectedElements(board);
  const backgroundColor = getBackgroundColor(board);

  return toSvgData(board, {
    fillStyle: isWhite(backgroundColor) ? TRANSPARENT : backgroundColor,
    padding: 20,
    ratio: 4,
    elements: selectedElements.length > 0 ? selectedElements : undefined,
    inlineStyleClassNames: '.plait-text-container',
    styleNames: ['position'],
  }).then((svgData) => {
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const imageName = `drawnix-${new Date().getTime()}.svg`;
    download(blob, imageName);
  });
};

export const saveAsImage = (board: PlaitBoard, isTransparent: boolean) => {
  const selectedElements = getSelectedElements(board);
  const backgroundColor = getBackgroundColor(board) || 'white';
  boardToImage(board, {
    elements: selectedElements.length > 0 ? selectedElements : undefined,
    fillStyle: isTransparent ? 'transparent' : backgroundColor,
  }).then((image) => {
    if (image) {
      const ext = isTransparent ? 'png' : 'jpg';
      const pngImage = base64ToBlob(image);
      const imageName = `drawnix-${new Date().getTime()}.${ext}`;
      download(pngImage, imageName);
    }
  });
};

export const copySelectionAsSvg = async (board: PlaitBoard) => {
  const blob = await getSelectedSvgBlob(board);
  const pngDataUrl = await getSelectedImageDataUrl(board, true);
  const pngBlob = pngDataUrl ? base64ToBlob(pngDataUrl) : null;
  await writeBlobToClipboard('svg', blob, pngBlob);
};

export const copySelectionAsImage = async (
  board: PlaitBoard,
  format: Exclude<ClipboardImageFormat, 'svg'>
) => {
  const imageDataUrl = await getSelectedImageDataUrl(board, format === 'png');
  if (!imageDataUrl) {
    return;
  }
  // Both png and jpg are written as image/png to the clipboard.
  // For jpg the image is rendered with an opaque background (isTransparent=false above),
  // which gives the same effect as JPEG (no transparency) since the Clipboard API
  // does not support image/jpeg in any browser.
  await writeBlobToClipboard('png', base64ToBlob(imageDataUrl));
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
