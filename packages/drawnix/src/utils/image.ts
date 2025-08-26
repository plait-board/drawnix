import { getSelectedElements, PlaitBoard, ThemeColorMode } from '@plait/core';
import { base64ToBlob, boardToImage, download } from './common';
import { fileOpen } from '../data/filesystem';
import { IMAGE_MIME_TYPES } from '../constants';
import { insertImage } from '../data/image';

// Get the actual background color from the board container
const getThemeBackgroundColor = (board: PlaitBoard): string => {
  try {
    const boardContainer = PlaitBoard.getBoardContainer(board);

    // Check multiple elements in the hierarchy for background color
    const elementsToCheck = [
      boardContainer,
      boardContainer.parentElement,
      boardContainer.closest('.drawnix'),
      document.body,
    ].filter(Boolean);

    for (const element of elementsToCheck) {
      if (element) {
        const computedStyle = window.getComputedStyle(element as Element);
        const backgroundColor = computedStyle.backgroundColor;

        // If we find a non-transparent background color, use it
        if (
          backgroundColor &&
          backgroundColor !== 'transparent' &&
          backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          backgroundColor !== 'initial' &&
          backgroundColor !== 'inherit'
        ) {
          return backgroundColor;
        }
      }
    }

    // If no background color found, use fallback
    return getThemeBackgroundColorFallback(board.theme.themeColorMode);
  } catch (error) {
    console.warn(
      'Could not get background color from DOM, using fallback',
      error
    );
    return getThemeBackgroundColorFallback(board.theme.themeColorMode);
  }
};

// Fallback theme background colors mapping
const getThemeBackgroundColorFallback = (
  themeColorMode: ThemeColorMode
): string => {
  switch (themeColorMode) {
    case ThemeColorMode.dark:
      return '#121212'; // Dark theme background (darker)
    case ThemeColorMode.starry:
      return '#0a0a1a'; // Starry theme background (very dark blue/purple)
    case ThemeColorMode.retro:
      return '#f4f1e8'; // Retro theme background (warm cream)
    case ThemeColorMode.colorful:
      return '#ffffff'; // Colorful theme background (pure white)
    case ThemeColorMode.soft:
      return '#f8f9fa'; // Soft theme background (very light gray)
    case ThemeColorMode.default:
    default:
      return '#ffffff'; // Default theme background (white)
  }
};

export const saveAsImage = (board: PlaitBoard, isTransparent: boolean) => {
  const selectedElements = getSelectedElements(board);
  const themeBackgroundColor = getThemeBackgroundColor(board);

  boardToImage(board, {
    elements: selectedElements.length > 0 ? selectedElements : undefined,
    fillStyle: isTransparent ? 'transparent' : themeBackgroundColor,
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
