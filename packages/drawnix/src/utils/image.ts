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
 * Determines if a CSS selector is relevant for text styling in SVG export
 * @param selectorText - The CSS selector text to evaluate
 * @returns true if the selector is relevant for text styling
 */
const isTextRelevantRule = (selectorText: string): boolean => {
  return Boolean(selectorText && (
    selectorText.includes('text') ||
    selectorText.includes('.') ||
    selectorText.includes('[')
  ));
};

/**
 * Extracts CSS rules from document stylesheets that are relevant for SVG text styling
 * @returns Array of CSS rule strings that should be included in the SVG export
 */
const extractCSSRules = (): string[] => {
  const cssRules: string[] = [];
  
  try {
    for (const styleSheet of Array.from(document.styleSheets)) {
      try {
        const rules = styleSheet.cssRules;
        if (!rules) continue;
        
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSStyleRule && isTextRelevantRule(rule.selectorText)) {
            cssRules.push(rule.cssText);
          }
        }
      } catch (e) {
        // Skip inaccessible stylesheets (CORS)
        console.log('Skipping stylesheet due to CORS restrictions:', e);
      }
    }
  } catch (e) {
    console.warn('Could not extract CSS styles - continuing without styles:', e);
  }
  
  return cssRules;
};

/**
 * Applies inline styles to SVG elements to preserve text appearance in exported SVG
 * @param svgClone - The cloned SVG element that will be exported
 * @param hostSVG - The original SVG element from the board (for computed style reference)
 */
const applyInlineStyles = (svgClone: SVGSVGElement, hostSVG: SVGSVGElement) => {
  const allElements = svgClone.querySelectorAll('*');
  
  allElements.forEach((element: Element) => {
    if (element.tagName.toLowerCase() === 'text' || 
        element.tagName.toLowerCase() === 'tspan' ||
        element.hasAttribute('class')) {
      
      // Find corresponding element in original DOM
      const testId = element.getAttribute('data-testid');
      const originalElement = testId 
        ? hostSVG.querySelector(`[data-testid="${testId}"]`)
        : hostSVG.querySelector(element.tagName.toLowerCase() + `:nth-child(${Array.from(element.parentNode?.children || []).indexOf(element) + 1})`);
      
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
 * 2. Clones the SVG to avoid modifying the original
 * 3. Ensures proper viewBox and namespace attributes
 * 4. Extracts and embeds relevant CSS rules
 * 5. Applies inline styles for better text preservation
 * 6. Serializes the SVG and initiates download
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

    // Clone the SVG to avoid modifying the original
    const svgClone = hostSVG.cloneNode(true) as SVGSVGElement;
    if (!svgClone) {
      console.error('Failed to clone SVG element');
      return;
    }
    
    // Get the current viewBox to ensure proper sizing
    const viewBox = svgClone.getAttribute('viewBox');
    if (!viewBox) {
      // Fallback: set viewBox based on SVG dimensions
      const rect = hostSVG.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
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

    // Extract and apply CSS styles
    const cssRules = extractCSSRules();
    if (cssRules.length > 0) {
      const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleElement.textContent = cssRules.join('\n');
      svgClone.insertBefore(styleElement, svgClone.firstChild);
    }

    // Apply inline styles for better text preservation
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
