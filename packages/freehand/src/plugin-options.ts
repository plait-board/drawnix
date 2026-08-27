import type { PlaitBoard, ThemeColorMode } from '@plait/core';
import { DEFAULT_FREEHAND_DRAW_OPTIONS, type FreehandDrawOptions } from './presets';
import { FreehandThemeColors } from './type';

export interface FreehandEraseTrail {
  init(board: PlaitBoard): void;
  destroy(): void;
}

export type FreehandThemeColor = {
  strokeColor: string;
  fill: string;
};

export type FreehandPluginOptions = {
  createEraseTrail?: () => FreehandEraseTrail;
  getDrawOptions?: (board: PlaitBoard) => Partial<FreehandDrawOptions>;
  isInteractionBlocked?: (board: PlaitBoard) => boolean;
  themeColors?: Partial<Record<ThemeColorMode, FreehandThemeColor>>;
};

type ResolvedFreehandPluginOptions = {
  createEraseTrail: () => FreehandEraseTrail;
  getDrawOptions: (board: PlaitBoard) => Partial<FreehandDrawOptions>;
  isInteractionBlocked: (board: PlaitBoard) => boolean;
  themeColors: Record<ThemeColorMode, FreehandThemeColor>;
};

const FREEHAND_PLUGIN_OPTIONS = new WeakMap<PlaitBoard, ResolvedFreehandPluginOptions>();

const createNoopEraseTrail = (): FreehandEraseTrail => ({
  init: () => {},
  destroy: () => {},
});

const resolveFreehandPluginOptions = (
  options: FreehandPluginOptions = {}
): ResolvedFreehandPluginOptions => ({
  createEraseTrail: options.createEraseTrail || createNoopEraseTrail,
  getDrawOptions: options.getDrawOptions || (() => DEFAULT_FREEHAND_DRAW_OPTIONS),
  isInteractionBlocked: options.isInteractionBlocked || (() => false),
  themeColors: {
    ...FreehandThemeColors,
    ...options.themeColors,
  },
});

export const setFreehandPluginOptions = (
  board: PlaitBoard,
  options: FreehandPluginOptions = {}
) => {
  FREEHAND_PLUGIN_OPTIONS.set(board, resolveFreehandPluginOptions(options));
};

export const getFreehandPluginOptions = (board: PlaitBoard) => {
  const options = FREEHAND_PLUGIN_OPTIONS.get(board);
  if (options) {
    return options;
  }

  const defaultOptions = resolveFreehandPluginOptions();
  FREEHAND_PLUGIN_OPTIONS.set(board, defaultOptions);
  return defaultOptions;
};
