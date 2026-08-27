import {
  createFreehandPlugin,
  resolveFreehandDrawOptions,
  type FreehandDrawOptions,
} from '@plait-board/freehand';
import { isTwoFingerMode } from '@plait-board/react-board';
import type { PlaitBoard } from '@plait/core';
import { DEFAULT_FREEHAND_PRESETS } from '../constants/freehand';
import type { DrawnixBoard } from '../hooks/use-drawnix';
import { LaserPointer } from '../utils/laser-pointer';

const getDrawOptions = (board: PlaitBoard): Partial<FreehandDrawOptions> => {
  const toolState = (board as DrawnixBoard).appState?.toolState;
  const activePresetIndex = toolState?.activeFreehandPresetIndex || 0;
  const activePreset =
    toolState?.freehandPresets?.[activePresetIndex] ||
    DEFAULT_FREEHAND_PRESETS[activePresetIndex] ||
    DEFAULT_FREEHAND_PRESETS[0];

  return resolveFreehandDrawOptions(activePreset);
};

export const withDrawnixFreehand = createFreehandPlugin({
  createEraseTrail: () => new LaserPointer(),
  getDrawOptions,
  isInteractionBlocked: isTwoFingerMode,
});
