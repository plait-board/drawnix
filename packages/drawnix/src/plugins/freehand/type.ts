import { DEFAULT_COLOR, Point, ThemeColorMode } from '@plait/core';
import { PlaitCustomGeometry } from '@plait/draw';

export const FreehandThemeColors = {
  [ThemeColorMode.default]: {
      strokeColor: DEFAULT_COLOR,
      fill: '#FFFFFF'
  },
  [ThemeColorMode.colorful]: {
      strokeColor: '#06ADBF',
      fill: '#CDEFF2'
  },
  [ThemeColorMode.soft]: {
      strokeColor: '#6D89C1',
      fill: '#DADFEB'
  },
  [ThemeColorMode.retro]: {
      strokeColor: '#E9C358',
      fill: '#F6EDCF'
  },
  [ThemeColorMode.dark]: {
      strokeColor: '#FFFFFF',
      fill: '#434343'
  },
  [ThemeColorMode.starry]: {
      strokeColor: '#42ABE5',
      fill: '#163F5A'
  }
};

export enum FreehandShape {
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
