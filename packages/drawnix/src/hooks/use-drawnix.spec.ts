import { PlaitPointerType } from '@plait/core';
import { ArrowLineShape, BasicShapes } from '@plait/draw';
import { describe, expect, it, vi } from 'vitest';
import { FreehandShape } from '../plugins/freehand/type';
import { createDefaultToolState, mergeToolState } from './use-drawnix';

vi.mock('@plait/core', () => ({
  DEFAULT_COLOR: '#000000',
  PlaitPointerType: {
    hand: 'hand',
    selection: 'selection',
  },
  ThemeColorMode: {
    default: 'default',
    colorful: 'colorful',
    soft: 'soft',
    retro: 'retro',
    dark: 'dark',
    starry: 'starry',
  },
}));

vi.mock('@plait/draw', () => ({
  ArrowLineShape: {
    straight: 'straight',
  },
  BasicShapes: {
    rectangle: 'rectangle',
    diamond: 'diamond',
  },
}));

vi.mock('@plait/mind', () => ({
  MindPointerType: {
    mind: 'mind',
  },
}));

describe('drawnix tool state', () => {
  it('creates the default persistent tool state', () => {
    const toolState = createDefaultToolState();

    expect(toolState.pointer).toBe(PlaitPointerType.hand);
    expect(toolState.lastShapePointer).toBe(BasicShapes.rectangle);
    expect(toolState.lastArrowPointer).toBe(ArrowLineShape.straight);
    expect(toolState.lastFreehandPointer).toBe(FreehandShape.feltTipPen);
    expect(toolState.activeFreehandPresetIndex).toBe(0);
    expect(toolState.freehandPresets.length).toBeGreaterThan(0);
  });

  it('merges stored partial tool state with safe defaults', () => {
    const storedPresets = [{ strokeColor: '#ff0000', strokeWidth: 8 }];

    const toolState = mergeToolState({
      pointer: BasicShapes.diamond,
      freehandPresets: storedPresets,
    });

    expect(toolState.pointer).toBe(BasicShapes.diamond);
    expect(toolState.lastShapePointer).toBe(BasicShapes.rectangle);
    expect(toolState.lastArrowPointer).toBe(ArrowLineShape.straight);
    expect(toolState.freehandPresets).toEqual(storedPresets);
    expect(toolState.freehandPresets).not.toBe(storedPresets);
    expect(toolState.freehandPresets[0]).not.toBe(storedPresets[0]);
  });
});
