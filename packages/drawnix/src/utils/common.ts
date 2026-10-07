import {
  getIsRecursionFunc,
  getSelectedElements,
  IS_APPLE,
  IS_MAC,
  PlaitBoard,
  PlaitElement,
  toImage,
  ToImageOptions,
} from '@plait/core';
import type { ResolutionType } from './utility-types';

export const isPromiseLike = (value: any): value is Promise<ResolutionType<typeof value>> => {
  return (
    !!value &&
    typeof value === 'object' &&
    'then' in value &&
    'catch' in value &&
    'finally' in value
  );
};

// taken from Radix UI
// https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
export const composeEventHandlers = <E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) => {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (!checkForDefaultPrevented || !(event as unknown as Event)?.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
};

export const base64ToBlob = (base64: string) => {
  const arr = base64.split(',');
  const fileType = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let l = bstr.length;
  const u8Arr = new Uint8Array(l);

  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l);
  }
  return new Blob([u8Arr], {
    type: fileType,
  });
};

export const boardToImage = (board: PlaitBoard, options: ToImageOptions = {}) => {
  return toImage(board, {
    fillStyle: 'transparent',
    inlineStyleClassNames: '.extend,.emojis,.text',
    padding: 20,
    ratio: 4,
    ...options,
  });
};

/**
 * Resolves the element list that image/PDF exports should render.
 *
 * `toSvgData`/`toImage` clone each element's own rendering `<g>` only. Mind map
 * descendants are rendered as sibling `<g>`s inside the root's container, so
 * passing a mind map root (or any ancestor node) alone silently drops its
 * subtree. Selected elements are therefore expanded with their visible
 * descendants (collapsed mind nodes stop the recursion). When nothing is
 * selected, `undefined` lets the core collect every board element recursively,
 * which is what keeps whole-board exports complete.
 */
export const getExportElements = (board: PlaitBoard): PlaitElement[] | undefined => {
  const selectedElements = getSelectedElements(board);
  if (selectedElements.length === 0) {
    return undefined;
  }
  const isRecursion = getIsRecursionFunc(board);
  const elements: PlaitElement[] = [];
  const visited = new Set<PlaitElement>();
  const collect = (element: PlaitElement) => {
    if (visited.has(element)) {
      return;
    }
    visited.add(element);
    elements.push(element);
    if (isRecursion(element)) {
      element.children?.forEach(collect);
    }
  };
  selectedElements.forEach(collect);
  return elements;
};

export function download(blob: Blob | MediaSource, filename: string) {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export const splitRows = <T>(shapes: T[], cols: number) => {
  const result = [];
  for (let i = 0; i < shapes.length; i += cols) {
    result.push(shapes.slice(i, i + cols));
  }
  return result;
};

export const getShortcutKey = (shortcut: string): string => {
  shortcut = shortcut
    .replace(/\bAlt\b/i, 'Alt')
    .replace(/\bShift\b/i, 'Shift')
    .replace(/\b(Enter|Return)\b/i, 'Enter');
  if (IS_APPLE || IS_MAC) {
    return shortcut.replace(/\bCtrlOrCmd\b/gi, 'Cmd').replace(/\bAlt\b/i, 'Option');
  }
  return shortcut.replace(/\bCtrlOrCmd\b/gi, 'Ctrl');
};
