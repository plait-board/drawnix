import {
  BOARD_TO_ELEMENT_HOST,
  BOARD_TO_HOST,
  createG,
  createSVG,
  createTestingBoard,
  NODE_TO_G,
  type PlaitElement,
} from '@plait/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { boardToImage } from './common';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const PNG_DATA_URL = 'data:image/png;base64,test';
const EXPECTED_STYLES = {
  position: 'relative',
  display: 'block',
  'white-space': 'pre-wrap',
  'overflow-wrap': 'anywhere',
  'word-break': 'break-word',
  'line-height': '20px',
  'min-height': '40px',
  'padding-top': '1px',
  'padding-bottom': '2px',
  'box-sizing': 'border-box',
} as const;

afterEach(() => {
  document.body.replaceChildren();
  document.head.querySelector('style[data-export-test-styles]')?.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('boardToImage', () => {
  it('serializes computed text container styles before rendering the image', async () => {
    const element = { id: 'text-1', type: 'geometry' } as PlaitElement;
    const board = createTestingBoard([], [element]);
    board.getRectangle = () => ({ x: 0, y: 0, width: 100, height: 40 });

    const svg = createSVG();
    const host = createG();
    const elementG = createG();
    const foreignObject = document.createElementNS(SVG_NAMESPACE, 'foreignObject');
    const textContainer = document.createElement('div');
    const editable = document.createElement('div');
    textContainer.className = 'plait-text-container';
    editable.className = 'slate-editable-container';
    editable.textContent = 'first line\nsecond line';
    textContainer.appendChild(editable);
    foreignObject.appendChild(textContainer);
    elementG.appendChild(foreignObject);
    host.appendChild(elementG);
    svg.appendChild(host);
    document.body.appendChild(svg);

    const stylesheet = document.createElement('style');
    stylesheet.setAttribute('data-export-test-styles', '');
    stylesheet.textContent = `.plait-text-container, .slate-editable-container {
      ${Object.entries(EXPECTED_STYLES)
        .map(([name, value]) => `${name}: ${value};`)
        .join('\n')}
    }`;
    document.head.appendChild(stylesheet);

    BOARD_TO_HOST.set(board, svg);
    BOARD_TO_ELEMENT_HOST.set(board, {
      lowerHost: host,
      host,
      upperHost: host,
      topHost: host,
      activeHost: host,
      container: document.body,
      viewportContainer: document.body,
    });
    NODE_TO_G.set(element, elementG);

    // jsdom has no rasterization support; keep the real export path and stub only that boundary.
    let imageSource = '';
    class FakeImage {
      crossOrigin = '';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(value: string) {
        imageSource = value;
        this.onload?.();
      }
    }
    vi.stubGlobal('Image', FakeImage);

    const drawImage = vi.fn();
    const canvasContext = {
      fillRect: vi.fn(),
      drawImage,
    } as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(canvasContext);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(PNG_DATA_URL);

    // The serialized styles must come from getComputedStyle, not cloneNode.
    expect(textContainer.getAttribute('style')).toBeNull();
    expect(editable.getAttribute('style')).toBeNull();

    const result = await boardToImage(board, { elements: [element] });

    expect(result).toBe(PNG_DATA_URL);
    expect(drawImage).toHaveBeenCalledOnce();
    expect(imageSource).toMatch(/^data:image\/svg\+xml;charset=utf-8,/);

    const svgData = decodeURIComponent(imageSource.slice(imageSource.indexOf(',') + 1));
    const exportedSvg = new DOMParser().parseFromString(svgData, 'image/svg+xml');

    for (const selector of ['.plait-text-container', '.slate-editable-container']) {
      const exportedContainer = exportedSvg.querySelector<HTMLElement>(selector);
      expect(exportedContainer).not.toBeNull();
      for (const [name, value] of Object.entries(EXPECTED_STYLES)) {
        expect(exportedContainer!.style.getPropertyValue(name)).toBe(value);
      }
    }
  });
});
