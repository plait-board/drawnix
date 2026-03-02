import { DEFAULT_COLOR, Point, ThemeColorMode } from '@plait/core';
import { PlaitCustomGeometry } from '@plait/draw';

export const FreehandThemeColors = {
  [ThemeColorMode.default]: {
      strokeColor: DEFAULT_COLOR,
      fill: 'none'
  },
  [ThemeColorMode.colorful]: {
      strokeColor: '#06ADBF',
      fill: 'none'
  },
  [ThemeColorMode.soft]: {
      strokeColor: '#6D89C1',
      fill: 'none'
  },
  [ThemeColorMode.retro]: {
      strokeColor: '#E9C358',
      fill: 'none'
  },
  [ThemeColorMode.dark]: {
      strokeColor: '#FFFFFF',
      fill: 'none'
  },
  [ThemeColorMode.starry]: {
      strokeColor: '#42ABE5',
      fill: 'none'
  }
};

export enum FreehandShape {
  eraser = 'eraser',
  nibPen = 'nibPen',
  feltTipPen = 'feltTipPen',
  artisticBrush = 'artisticBrush',
  markerHighlight = 'markerHighlight',
}

export const FREEHAND_TYPE = 'freehand';

export type Freehand = PlaitCustomGeometry<typeof FREEHAND_TYPE, Point[], FreehandShape>

export const Freehand = {
  isFreehand: (value: any): value is Freehand => {
    return value.type === FREEHAND_TYPE;
  },
};
