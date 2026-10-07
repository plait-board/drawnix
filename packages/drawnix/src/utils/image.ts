import { PlaitBoard, PlaitElement, toSvgData } from '@plait/core';
import { base64ToBlob, boardToImage, download, getExportElements } from './common';
import { fileOpen } from '../data/filesystem';
import { IMAGE_MIME_TYPES } from '../constants';
import { insertImage } from '../data/image';
import { getBackgroundColor } from './color';
import { TRANSPARENT } from '../constants/color';
import type { DrawnixBoard } from '../hooks/use-drawnix';
import { i18nInsidePlaitHook, type Translations } from '../i18n';

type ClipboardImageFormat = 'svg' | 'png';
type ExportElements = PlaitElement[];

const CLIPBOARD_MIME_TYPES: Record<ClipboardImageFormat, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
};

const COPY_TOAST_KEYS: Record<ClipboardImageFormat, keyof Translations> = {
  svg: 'toast.copyToClipboard.svg',
  png: 'toast.copyToClipboard.png',
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

const showCopySuccessToast = (
  board: PlaitBoard,
  format: ClipboardImageFormat,
  isTransparent: boolean
) => {
  const { t } = i18nInsidePlaitHook(board);

  (board as DrawnixBoard).showToast?.({
    type: 'success',
    message: t(COPY_TOAST_KEYS[format]),
    description: isTransparent ? t('toast.copyToClipboard.mode.transparent') : undefined,
  });
};

/**
 * Injects real hyperlinks into an exported SVG string.
 *
 * Board text links are rendered as `<a class="plait-board-link" data-url="...">`
 * without `href` (clicks are intercepted by the in-app link popup). After
 * `toSvgData` clones the DOM into the SVG, this post-processing step promotes
 * `data-url` to a real `href` so the exported file keeps clickable links.
 */
export const enrichSvgLinks = (svgData: string): string => {
  const doc = new DOMParser().parseFromString(svgData, 'image/svg+xml');
  const links = doc.querySelectorAll<HTMLAnchorElement>('a.plait-board-link[data-url]');
  links.forEach((link) => {
    const url = link.getAttribute('data-url')?.trim();
    if (!url) {
      return;
    }
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  return new XMLSerializer().serializeToString(doc.documentElement);
};

const getSvgBlob = async (board: PlaitBoard, isTransparent: boolean, elements?: ExportElements) => {
  const backgroundColor = getBackgroundColor(board) || 'white';
  const fillStyle = isTransparent ? TRANSPARENT : backgroundColor;
  const svgData = await toSvgData(board, {
    fillStyle,
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
  const exportTransparent = !!(board as DrawnixBoard).appState?.exportTransparent;
  return getSvgBlob(board, exportTransparent, getExportElements(board)).then((blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      const svgWithLinks = enrichSvgLinks(reader.result as string);
      const imageName = `drawnix-${new Date().getTime()}.svg`;
      download(new Blob([svgWithLinks], { type: CLIPBOARD_MIME_TYPES.svg }), imageName);
    };
    reader.readAsText(blob);
  });
};

export const saveAsPng = (board: PlaitBoard) => {
  const exportTransparent = !!(board as DrawnixBoard).appState?.exportTransparent;
  getImageBlob(board, exportTransparent, getExportElements(board)).then((imageBlob) => {
    if (imageBlob) {
      const ext = 'png';
      const imageName = `drawnix-${new Date().getTime()}.${ext}`;
      download(imageBlob, imageName);
    }
  });
};

export const copySelectionAsSvg = async (board: PlaitBoard) => {
  const copyTransparent = !!(board as DrawnixBoard).appState?.copyTransparent;
  const elements = getExportElements(board);
  if (!elements) {
    return;
  }
  const [blob, pngBlob] = await Promise.all([
    getSvgBlob(board, copyTransparent, elements),
    getImageBlob(board, copyTransparent, elements),
  ]);
  await writeBlobToClipboard('svg', blob, pngBlob);
  showCopySuccessToast(board, 'svg', copyTransparent);
};

export const copySelectionAsPng = async (board: PlaitBoard) => {
  const copyTransparent = !!(board as DrawnixBoard).appState?.copyTransparent;
  const elements = getExportElements(board);
  if (!elements) {
    return;
  }
  const imageBlob = await getImageBlob(board, copyTransparent, elements);
  if (!imageBlob) {
    return;
  }
  // The clipboard only gets image/png. The background choice is controlled by
  // how the image is rendered before writing to the clipboard.
  await writeBlobToClipboard('png', imageBlob);
  showCopySuccessToast(board, 'png', copyTransparent);
};

export const addImage = async (board: PlaitBoard) => {
  const imageFile = await fileOpen({
    description: 'Image',
    extensions: Object.keys(IMAGE_MIME_TYPES) as (keyof typeof IMAGE_MIME_TYPES)[],
  });
  insertImage(board, imageFile);
};
