import { getSelectedElements, PlaitBoard } from '@plait/core';
import { base64ToBlob, boardToImage, download } from './common';
import { fileOpen } from '../data/filesystem';
import { IMAGE_MIME_TYPES } from '../constants';
import { insertImage } from '../data/image';

/**
 * Exports the current board content as an image (PNG or JPG)
 * @param board - The PlaitBoard instance to export
 * @param isTransparent - Whether to use transparent background (PNG) or white background (JPG)
 */
export const saveAsImage = (board: PlaitBoard, isTransparent: boolean) => {
  try {
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
      } else {
        console.error('Failed to generate image from board - no image data returned');
      }
    }).catch((error) => {
      console.error('Error generating image:', error);
    });
  } catch (error) {
    console.error('Error during image export process:', error);
  }
};

/**
 * Opens a file dialog to select an image and adds it to the board
 * @param board - The PlaitBoard instance to add the image to
 */
export const addImage = async (board: PlaitBoard) => {
  const imageFile = await fileOpen({
    description: 'Image',
    extensions: Object.keys(
      IMAGE_MIME_TYPES
    ) as (keyof typeof IMAGE_MIME_TYPES)[],
  });
  insertImage(board, imageFile);
};

/**
 * Calculates the bounding box of all visible elements in the SVG
 * @param svgElement - The SVG element to analyze
 * @returns The bounding box {x, y, width, height} or null if no content
 */
const getContentBounds = (svgElement: SVGSVGElement): {x: number, y: number, width: number, height: number} | null => {
  const elements = svgElement.querySelectorAll('*');
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let hasContent = false;

  elements.forEach((element) => {
    if (element instanceof SVGGraphicsElement && element.getBBox) {
      try {
        const bbox = element.getBBox();
        if (bbox.width > 0 && bbox.height > 0) {
          minX = Math.min(minX, bbox.x);
          minY = Math.min(minY, bbox.y);
          maxX = Math.max(maxX, bbox.x + bbox.width);
          maxY = Math.max(maxY, bbox.y + bbox.height);
          hasContent = true;
        }
      } catch {
        // Skip elements that can't get bbox (like <defs>)
      }
    }
  });

  if (!hasContent) return null;

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

/**
 * Filters SVG content to include only selected elements
 * @param svgClone - The cloned SVG element
 * @param selectedElements - Array of selected Plait elements
 * @returns Filtered SVG with only selected content
 */
const filterSelectedElements = (svgClone: SVGSVGElement, selectedElements: unknown[]): SVGSVGElement => {
  if (!selectedElements || selectedElements.length === 0) {
    return svgClone;
  }

  // For now, return the full SVG - selected element filtering needs more investigation
  // into how Plait elements map to SVG elements
  console.log('Selected elements found, but filtering not yet implemented:', selectedElements.length);
  return svgClone;
};

/**
 * Fixes text line breaks by ensuring proper tspan handling
 * @param svgElement - The SVG element to process
 */
const fixTextLineBreaks = (svgElement: SVGSVGElement) => {
  const textElements = svgElement.querySelectorAll('text');

  textElements.forEach((textElement) => {
    const tspans = textElement.querySelectorAll('tspan');
    if (tspans.length > 0) {
      // Ensure tspans have proper dy attributes for line breaks
      tspans.forEach((tspan, index) => {
        if (index > 0 && !tspan.getAttribute('dy')) {
          tspan.setAttribute('dy', '1.2em');
        }
        const textX = textElement.getAttribute('x');
        if (!tspan.getAttribute('x') && textX) {
          tspan.setAttribute('x', textX);
        }
      });
    }
  });
};

/**
 * Finds the corresponding element in the original DOM for a cloned element
 * @param element - The element from the cloned SVG
 * @param hostSVG - The original SVG element
 * @returns The corresponding element in the original DOM or null if not found
 */
const findCorrespondingElement = (element: Element, hostSVG: SVGSVGElement): Element | null => {
  // Try to find by data-testid first (most reliable)
  const testId = element.getAttribute('data-testid');
  if (testId) {
    return hostSVG.querySelector(`[data-testid="${testId}"]`);
  }

  // Fallback: find by tag name and position in parent
  if (element.parentNode) {
    const siblings = Array.from(element.parentNode.children);
    const index = siblings.indexOf(element);
    if (index !== -1) {
      const selector = `${element.tagName.toLowerCase()}:nth-child(${index + 1})`;
      return hostSVG.querySelector(selector);
    }
  }

  return null;
};
const applyInlineStyles = (svgClone: SVGSVGElement, hostSVG: SVGSVGElement) => {
  const allElements = svgClone.querySelectorAll('*');
  
  allElements.forEach((element: Element) => {
    if (element.tagName.toLowerCase() === 'text' || 
        element.tagName.toLowerCase() === 'tspan' ||
        element.hasAttribute('class')) {
      
      // Find corresponding element in original DOM
      const originalElement = findCorrespondingElement(element, hostSVG);
      
      if (originalElement) {
        const computedStyle = window.getComputedStyle(originalElement);
        const importantStyles = [
          'font-family', 'font-size', 'font-weight', 'font-style',
          'fill', 'stroke', 'opacity', 'visibility', 'text-anchor',
          'dominant-baseline', 'alignment-baseline', 'color'
        ];
        
        const styleAttr = importantStyles
          .map(prop => {
            const value = computedStyle.getPropertyValue(prop);
            return value ? `${prop}:${value}` : '';
          })
          .filter(Boolean)
          .join(';');
          
        if (styleAttr) {
          element.setAttribute('style', styleAttr);
        }
      }
    }
  });
};

/**
 * Exports the current board content as an SVG file with preserved styling
 *
 * This function performs the following operations:
 * 1. Retrieves the SVG element from the board
 * 2. Filters to selected elements if any are selected
 * 3. Clones the SVG to avoid modifying the original
 * 4. Fixes text line breaks for proper display
 * 5. Calculates content bounds and adjusts viewBox to remove margins
 * 6. Applies inline styles for better text preservation (no <style> element)
 * 7. Serializes the SVG and initiates download
 *
 * @param board - The PlaitBoard instance to export as SVG
 */
export const saveAsSVG = (board: PlaitBoard) => {
  try {
    // Get the main SVG element from the board
    const hostSVG = PlaitBoard.getHost(board);
    if (!hostSVG) {
      console.error('Could not find board SVG element - board may not be properly initialized');
      return;
    }
    if (!(hostSVG instanceof SVGSVGElement)) {
      console.error('Board host element is not an SVGSVGElement');
      return;
    }

    // Get selected elements to determine export scope
    const selectedElements = getSelectedElements(board);

    // Clone the SVG to avoid modifying the original
    let svgClone = hostSVG.cloneNode(true) as SVGSVGElement;

    // Filter to selected elements if any are selected
    if (selectedElements && selectedElements.length > 0) {
      svgClone = filterSelectedElements(svgClone, selectedElements);
    }

    // Fix text line breaks
    fixTextLineBreaks(svgClone);

    // Calculate content bounds for tight cropping
    const contentBounds = getContentBounds(svgClone);
    if (contentBounds) {
      // Set viewBox to content bounds to remove unnecessary margins
      const padding = 10; // Small padding around content
      const viewBoxX = contentBounds.x - padding;
      const viewBoxY = contentBounds.y - padding;
      const viewBoxWidth = Math.max(1, contentBounds.width + (padding * -2));
      const viewBoxHeight = Math.max(1, contentBounds.height + (padding * -2));

      svgClone.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
      svgClone.setAttribute('width', viewBoxWidth.toString());
      svgClone.setAttribute('height', viewBoxHeight.toString());
    } else {
      // Fallback: use original dimensions if bounds calculation fails
      const rect = hostSVG.getBoundingClientRect();
      if (rect.width < 0.01 || rect.height < 0.01) {
        console.error('SVG element has invalid dimensions');
        return;
      }
      svgClone.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
      svgClone.setAttribute('width', rect.width.toString());
      svgClone.setAttribute('height', rect.height.toString());
    }

    // Ensure SVG has proper namespace
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    // Apply inline styles for better text preservation (no <style> element)
    applyInlineStyles(svgClone, hostSVG);

    // Get SVG as string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);

    if (!svgString || svgString.length === 0) {
      console.error('Failed to serialize SVG to string');
      return;
    }

    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const svgName = `drawnix-${new Date().getTime()}.svg`;
    download(blob, svgName);
  } catch (error) {
    console.error('Error exporting SVG:', error);
  }
};
