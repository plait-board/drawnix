import type React from 'react';
import { EraseIcon, FeltTipPenIcon } from '../components/icons';
import {
  DEFAULT_FREEHAND_STROKE_WIDTH,
  FreehandShape,
  type FreehandDrawOptions,
} from '@plait-board/freehand';
import type { Translations } from '../i18n';
import { CLASSIC_COLORS } from './color';

export const FREEHAND_PRESET_IDS = ['preset-1', 'preset-2', 'preset-3'] as const;

export type FreehandPresetId = (typeof FREEHAND_PRESET_IDS)[number];

const getClassicColorValue = (name: string) => {
  return CLASSIC_COLORS.find((item) => item.name === name)?.value;
};

export const DEFAULT_FREEHAND_PRESETS: FreehandDrawOptions[] = [
  {
    strokeWidth: DEFAULT_FREEHAND_STROKE_WIDTH,
  },
  {
    strokeColor: getClassicColorValue('color.red') || CLASSIC_COLORS[5].value,
    strokeWidth: 6,
  },
  {
    strokeColor: getClassicColorValue('color.green') || CLASSIC_COLORS[6].value,
    strokeWidth: 10,
  },
];

export type FreehandToolItem = {
  titleKey: keyof Translations;
  icon: React.ReactNode;
  pointer: FreehandShape.feltTipPen | FreehandShape.eraser;
};

export const FREEHANDS: FreehandToolItem[] = [
  {
    icon: FeltTipPenIcon,
    pointer: FreehandShape.feltTipPen,
    titleKey: 'toolbar.pen',
  },
  {
    icon: EraseIcon,
    pointer: FreehandShape.eraser,
    titleKey: 'toolbar.eraser',
  },
];
