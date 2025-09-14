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

const isTextRelevantRule = (selectorText: string): boolean => {
  return Boolean(selectorText && (
    selectorText.includes('text') ||
    selectorText.includes('.') ||
    selectorText.includes('[')
  ));
};

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
        console.log('Skipping stylesheet due to CORS:', e);
      }
    }
  } catch (e) {
    console.log('Could not extract styles:', e);
  }
  
  return cssRules;
};

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
    
    // Get the current viewBox to ensure proper sizing
    const viewBox = svgClone.getAttribute('viewBox');
    if (!viewBox) {
      // Fallback: set viewBox based on SVG dimensions
      const rect = hostSVG.getBoundingClientRect();
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
    
    // Create blob and download
    const blob = new Blob([svgString], { type: IMAGE_MIME_TYPES.svg });
    const svgName = `drawnix-${new Date().getTime()}.svg`;
    download(blob, svgName);
  } catch (error) {
    console.error('Error exporting SVG:', error);
  }
};
