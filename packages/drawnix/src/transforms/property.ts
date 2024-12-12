import { PropertyTransforms } from '@plait/common';
import {
  isNullOrUndefined,
  Path,
  PlaitBoard,
  PlaitElement,
  Transforms,
} from '@plait/core';
import { getMemorizeKey } from '@plait/draw';
import {
  applyOpacityToHex,
  hexAlphaToOpacity,
  isFullyOpaque,
  isNoColor,
  isValidColor,
  removeHexAlpha,
} from '../utils/color';
import {
  getCurrentFill,
  getCurrentStrokeColor,
  isClosedElement,
} from '../utils/property';
import { TextTransforms } from '@plait/text-plugins';

export const setFillColorOpacity = (board: PlaitBoard, fillOpacity: number) => {
  PropertyTransforms.setFillColor(board, null, {
    getMemorizeKey,
    callback: (element: PlaitElement, path: Path) => {
      if (!isClosedElement(board, element)) {
        return;
      }
      const currentFill = getCurrentFill(board, element);
      if (!isValidColor(currentFill)) {
        return;
      }
      const currentFillColor = removeHexAlpha(currentFill);
      const newFill = isFullyOpaque(fillOpacity)
        ? currentFillColor
        : applyOpacityToHex(currentFillColor, fillOpacity);
      Transforms.setNode(board, { fill: newFill }, path);
    },
  });
};

export const setFillColor = (board: PlaitBoard, fillColor: string) => {
  PropertyTransforms.setFillColor(board, null, {
    getMemorizeKey,
    callback: (element: PlaitElement, path: Path) => {
      if (!isClosedElement(board, element)) {
        return;
      }
      const currentFill = getCurrentFill(board, element);
      const currentOpacity = hexAlphaToOpacity(currentFill);
      if (isNoColor(fillColor)) {
        Transforms.setNode(board, { fill: null }, path);
      } else {
        if (
          isNullOrUndefined(currentOpacity) ||
          isFullyOpaque(currentOpacity)
        ) {
          Transforms.setNode(board, { fill: fillColor }, path);
        } else {
          Transforms.setNode(
            board,
            { fill: applyOpacityToHex(fillColor, currentOpacity) },
            path
          );
        }
      }
    },
  });
};

export const setStrokeColorOpacity = (
  board: PlaitBoard,
  fillOpacity: number
) => {
  PropertyTransforms.setStrokeColor(board, null, {
    getMemorizeKey,
    callback: (element: PlaitElement, path: Path) => {
      const currentStrokeColor = getCurrentStrokeColor(board, element);
      const currentStrokeColorValue = removeHexAlpha(currentStrokeColor);
      const newStrokeColor = isFullyOpaque(fillOpacity)
        ? currentStrokeColorValue
        : applyOpacityToHex(currentStrokeColorValue, fillOpacity);
      Transforms.setNode(board, { strokeColor: newStrokeColor }, path);
    },
  });
};

export const setStrokeColor = (board: PlaitBoard, newColor: string) => {
  PropertyTransforms.setStrokeColor(board, null, {
    getMemorizeKey,
    callback: (element: PlaitElement, path: Path) => {
      const currentStrokeColor = getCurrentStrokeColor(board, element);
      const currentOpacity = hexAlphaToOpacity(currentStrokeColor);
      if (isNoColor(newColor)) {
        Transforms.setNode(board, { strokeColor: null }, path);
      } else {
        if (
          isNullOrUndefined(currentOpacity) ||
          isFullyOpaque(currentOpacity)
        ) {
          Transforms.setNode(board, { strokeColor: newColor }, path);
        } else {
          Transforms.setNode(
            board,
            { strokeColor: applyOpacityToHex(newColor, currentOpacity) },
            path
          );
        }
      }
    },
  });
};

export const setTextColor = (
  board: PlaitBoard,
  currentColor: string,
  newColor: string
) => {
  const currentOpacity = hexAlphaToOpacity(currentColor);
  if (isNoColor(newColor)) {
    TextTransforms.setTextColor(board, null);
  } else {
    TextTransforms.setTextColor(
      board,
      applyOpacityToHex(newColor, currentOpacity)
    );
  }
};

export const setTextColorOpacity = (
  board: PlaitBoard,
  currentColor: string,
  opacity: number
) => {
  const currentFontColorValue = removeHexAlpha(currentColor);
  const newFontColor = isFullyOpaque(opacity)
    ? currentFontColorValue
    : applyOpacityToHex(currentFontColorValue, opacity);
  TextTransforms.setTextColor(board, newFontColor);
};
