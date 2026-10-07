import { PlaitBoard, PlaitElement, toSvgData, toViewBoxPoint } from '@plait/core';
import { download, getExportElements } from './common';
import { getBackgroundColor } from './color';
import type { DrawnixBoard } from '../hooks/use-drawnix';

const EXPORT_PADDING = 20;
const PREFERRED_RATIO = 3;
const MIN_RATIO = 0.2;
// Cap the rasterized canvas side to stay within safe browser canvas limits.
const MAX_RASTERIZED_SIDE = 8192;
// PDF viewers commonly cap a page at 200in (14400pt = 19200px at 96dpi).
const MAX_PDF_PAGE_SIDE = 19200;

interface LinkAnnotation {
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load exported SVG for PDF rasterization'));
    img.src = src;
  });

/**
 * Collects clickable link annotations for the exported elements.
 *
 * Board text links are rendered as `<a class="plait-board-link" data-url="...">`.
 * Their screen rectangles are converted to the export viewBox coordinate space
 * (relative to the SVG root produced by `toSvgData`), so annotations align
 * exactly with the rasterized image.
 */
const collectLinkAnnotations = (
  board: PlaitBoard,
  elements: PlaitElement[],
  viewBox: { x: number; y: number }
): LinkAnnotation[] => {
  const hostRect = PlaitBoard.getHost(board).getBoundingClientRect();
  const containers =
    elements.length > 0
      ? elements
          .map((element) => PlaitElement.getElementG(element))
          .filter((g): g is SVGGElement => !!g)
      : [PlaitBoard.getElementHost(board)];

  const annotations: LinkAnnotation[] = [];
  const visited = new Set<HTMLAnchorElement>();

  containers.forEach((container) => {
    const links = container.querySelectorAll<HTMLAnchorElement>('a.plait-board-link[data-url]');
    links.forEach((link) => {
      if (visited.has(link)) {
        return;
      }
      visited.add(link);

      const url = link.getAttribute('data-url')?.trim();
      if (!url) {
        return;
      }

      const rect = link.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      const leftTop = toViewBoxPoint(board, [rect.x - hostRect.x, rect.y - hostRect.y]);
      const rightBottom = toViewBoxPoint(board, [
        rect.right - hostRect.x,
        rect.bottom - hostRect.y,
      ]);

      annotations.push({
        x: leftTop[0] - viewBox.x,
        y: leftTop[1] - viewBox.y,
        width: rightBottom[0] - leftTop[0],
        height: rightBottom[1] - leftTop[1],
        url,
      });
    });
  });

  return annotations;
};

/**
 * Resolves the jsPDF page layout for the given page size.
 *
 * jsPDF swaps `format` width/height whenever the orientation does not match
 * the aspect ratio (portrait is the default), which silently turned landscape
 * boards into portrait pages and truncated their right side. Declaring the
 * orientation from the aspect ratio keeps the format untouched.
 */
export const resolvePageLayout = (
  pageWidth: number,
  pageHeight: number
): { orientation: 'landscape' | 'portrait'; format: [number, number] } => {
  return {
    orientation: pageWidth >= pageHeight ? 'landscape' : 'portrait',
    format: [pageWidth, pageHeight],
  };
};

/**
 * Exports the board (or the current selection) as a single-page PDF.
 *
 * The page is a high-resolution rasterized snapshot of the board for 100%
 * visual fidelity, with transparent link annotations layered on top at the
 * exact position of each text link so they remain clickable in PDF readers.
 */
export const saveAsPdf = async (board: PlaitBoard): Promise<void> => {
  const drawnixBoard = board as DrawnixBoard;
  const exportTransparent = !!drawnixBoard.appState?.exportTransparent;
  // `undefined` when nothing is selected, so `toSvgData` falls back to its
  // full recursive element collection. Passing `board.children` here used to
  // drop mind map subtrees: only the root element's own `<g>` (the central
  // topic) was cloned because descendants render as sibling `<g>`s.
  const elements = getExportElements(board);

  const svgData = await toSvgData(board, {
    fillStyle: '',
    padding: EXPORT_PADDING,
    elements,
    inlineStyleClassNames: '.plait-text-container',
    styleNames: ['position'],
  });

  const svgDoc = new DOMParser().parseFromString(svgData, 'image/svg+xml');
  const viewBoxAttr = svgDoc.documentElement.getAttribute('viewBox') ?? '';
  const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewBoxAttr
    .split(',')
    .map((value) => parseFloat(value.trim()));

  if (!viewBoxWidth || !viewBoxHeight) {
    throw new Error('Exported SVG is missing a valid viewBox');
  }

  const annotations = collectLinkAnnotations(board, elements ?? [], {
    x: viewBoxX,
    y: viewBoxY,
  });

  // Rasterize at a high ratio, capped so huge boards stay within canvas limits.
  const maxSide = Math.max(viewBoxWidth, viewBoxHeight);
  const ratio = Math.min(PREFERRED_RATIO, Math.max(MIN_RATIO, MAX_RASTERIZED_SIDE / maxSide));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(viewBoxWidth * ratio));
  canvas.height = Math.max(1, Math.round(viewBoxHeight * ratio));
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable');
  }

  if (!exportTransparent) {
    ctx.fillStyle = getBackgroundColor(board) || 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
  const img = await loadImage(svgUrl);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageDataUrl = canvas.toDataURL('image/png');

  // Keep the PDF page within viewer-supported limits by scaling if needed.
  const pageScale = Math.min(1, MAX_PDF_PAGE_SIDE / maxSide);
  const pageWidth = viewBoxWidth * pageScale;
  const pageHeight = viewBoxHeight * pageScale;

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    unit: 'px',
    ...resolvePageLayout(pageWidth, pageHeight),
    compress: true,
  });

  doc.addImage(imageDataUrl, 'PNG', 0, 0, pageWidth, pageHeight);

  annotations.forEach(({ x, y, width, height, url }) => {
    doc.link(x * pageScale, y * pageScale, width * pageScale, height * pageScale, { url });
  });

  const blob = doc.output('blob');
  download(blob, `drawnix-${new Date().getTime()}.pdf`);
};
