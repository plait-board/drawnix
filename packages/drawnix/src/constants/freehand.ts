import type React from 'react';
import { EraseIcon, FeltTipPenIcon } from '../components/icons';
import { FreehandShape } from '../plugins/freehand/type';
import type { Translations } from '../i18n';

export const FREEHAND_PRESET_IDS = [
  'preset-1',
  'preset-2',
  'preset-3',
] as const;

export type FreehandPresetId = (typeof FREEHAND_PRESET_IDS)[number];

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
