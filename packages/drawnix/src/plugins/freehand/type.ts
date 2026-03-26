import { DEFAULT_COLOR, Point, ThemeColorMode } from '@plait/core';
import { PlaitCustomGeometry } from '@plait/draw';

export {
  DEFAULT_FREEHAND_STROKE_WIDTH,
  FREEHAND_STROKE_WIDTH_STEP,
  MAX_FREEHAND_STROKE_WIDTH,
  MIN_FREEHAND_STROKE_WIDTH,
} from './presets';

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
  eraser = 'eraser',
  nibPen = 'nibPen',
  feltTipPen = 'feltTipPen',
  artisticBrush = 'artisticBrush',
  markerHighlight = 'markerHighlight',
}

export const FREEHAND_TYPE = 'freehand';

export type Freehand = PlaitCustomGeometry<typeof FREEHAND_TYPE, Point[], FreehandShape>

export const Freehand = {
  isFreehand: (value: unknown): value is Freehand => {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in value &&
      value.type === FREEHAND_TYPE
    );
  },
};
