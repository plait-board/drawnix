import { CLASSIC_COLORS } from './color';
import type React from 'react';
import { EraseIcon, FeltTipPenIcon } from '../components/icons';
import { FreehandShape } from '../plugins/freehand/type';
import type { Translations } from '../i18n';

export const DEFAULT_FREEHAND_PRESET_SIZES = {
  preset1: 2,
  preset2: 6,
  preset3: 10,
} as const;

export type FreehandToolItem = {
  type: 'tool';
  titleKey: keyof Translations;
  icon: React.ReactNode;
  pointer: FreehandShape.feltTipPen | FreehandShape.eraser;
};

export type FreehandPresetItem = {
  type: 'preset';
  id: string;
  color: string;
  size: number;
};

export type FreehandItem = FreehandToolItem | FreehandPresetItem;

const getClassicColorValue = (name: string) => {
  return CLASSIC_COLORS.find((item) => item.name === name)?.value;
};

export const DEFAULT_FREEHAND_PRESETS: FreehandPresetItem[] = [
  {
    type: 'preset',
    id: 'preset-1',
    color: getClassicColorValue('color.default') || CLASSIC_COLORS[1].value,
    size: DEFAULT_FREEHAND_PRESET_SIZES.preset1,
  },
  {
    type: 'preset',
    id: 'preset-2',
    color: getClassicColorValue('color.red') || CLASSIC_COLORS[5].value,
    size: DEFAULT_FREEHAND_PRESET_SIZES.preset2,
  },
  {
    type: 'preset',
    id: 'preset-3',
    color: getClassicColorValue('color.green') || CLASSIC_COLORS[6].value,
    size: DEFAULT_FREEHAND_PRESET_SIZES.preset3,
  },
];

export const FreeHandItems: FreehandItem[] = [
  {
    type: 'tool',
    icon: FeltTipPenIcon,
    pointer: FreehandShape.feltTipPen,
    titleKey: 'toolbar.pen',
  },
  {
    type: 'tool',
    icon: EraseIcon,
    pointer: FreehandShape.eraser,
    titleKey: 'toolbar.eraser',
  },
  ...DEFAULT_FREEHAND_PRESETS,
];

export const FREEHANDS = FreeHandItems;
