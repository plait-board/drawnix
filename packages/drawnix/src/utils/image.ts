import { getSelectedElements, PlaitBoard, toSvgData } from '@plait/core';
import { base64ToBlob, boardToImage, download } from './common';
import { fileOpen } from '../data/filesystem';
import { IMAGE_MIME_TYPES } from '../constants';
import { insertImage } from '../data/image';
import { getBackgroundColor, isWhite } from './color';
import { TRANSPARENT } from '../constants/color';

type ClipboardImageFormat = 'svg' | 'png';
type ExportElements = ReturnType<typeof getSelectedElements>;

const CLIPBOARD_MIME_TYPES: Record<ClipboardImageFormat, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
};

const hasClipboardWriteSupport = () => {
  // Keep the ClipboardItem check local until the shared helper also covers it.
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
  const supports = getClipboardItemSupports();
  if (typeof supports === 'function') {
    return supports(CLIPBOARD_MIME_TYPES[format]);
  }
  return format === 'png';
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

const getSvgBlob = async (board: PlaitBoard, elements?: ExportElements) => {
  const backgroundColor = getBackgroundColor(board);
  const svgData = await toSvgData(board, {
    fillStyle: isWhite(backgroundColor) ? TRANSPARENT : backgroundColor,
    padding: 20,
    ratio: 4,
    elements,
    inlineStyleClassNames: '.plait-text-container',
    styleNames: ['position'],
  });
  return new Blob([svgData], { type: CLIPBOARD_MIME_TYPES.svg });
};

const getImageBlob = async (
  board: PlaitBoard,
  isTransparent: boolean,
  elements?: ExportElements
) => {
  const backgroundColor = getBackgroundColor(board) || 'white';
  const imageDataUrl = await boardToImage(board, {
    elements,
    fillStyle: isTransparent ? 'transparent' : backgroundColor,
  });
  return imageDataUrl ? base64ToBlob(imageDataUrl) : null;
};

export const saveAsSvg = (board: PlaitBoard) => {
  const selectedElements = getSelectedElements(board);
  return getSvgBlob(
    board,
    selectedElements.length > 0 ? selectedElements : undefined
  ).then((blob) => {
    const imageName = `drawnix-${new Date().getTime()}.svg`;
    download(blob, imageName);
  });
};

export const saveAsImage = (board: PlaitBoard, isTransparent: boolean) => {
  const selectedElements = getSelectedElements(board);
  getImageBlob(
    board,
    isTransparent,
    selectedElements.length > 0 ? selectedElements : undefined
  ).then((imageBlob) => {
    if (imageBlob) {
      const ext = isTransparent ? 'png' : 'jpg';
      const imageName = `drawnix-${new Date().getTime()}.${ext}`;
      download(imageBlob, imageName);
    }
  });
};

export const copySelectionAsSvg = async (board: PlaitBoard) => {
  const selectedElements = getSelectedElements(board);
  if (selectedElements.length === 0) {
    return;
  }
  const [blob, pngBlob] = await Promise.all([
    getSvgBlob(board, selectedElements),
    getImageBlob(board, true, selectedElements),
  ]);
  await writeBlobToClipboard('svg', blob, pngBlob);
};

export const copySelectionAsPng = async (
  board: PlaitBoard,
  withBackground = false
) => {
  const selectedElements = getSelectedElements(board);
  if (selectedElements.length === 0) {
    return;
  }
  const imageBlob = await getImageBlob(
    board,
    !withBackground,
    selectedElements
  );
  if (!imageBlob) {
    return;
  }
  // The clipboard only gets image/png. The background choice is controlled by
  // how the image is rendered before writing to the clipboard.
  await writeBlobToClipboard('png', imageBlob);
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
