import { ThemeColorMode, type PlaitBoard } from '@plait/core';
import { describe, expect, it } from 'vitest';
import { getFreehandPluginOptions, setFreehandPluginOptions } from './plugin-options';

describe('freehand plugin options', () => {
  it('merges a theme override without dropping package defaults', () => {
    const board = {} as PlaitBoard;

    setFreehandPluginOptions(board, {
      themeColors: {
        [ThemeColorMode.default]: {
          strokeColor: '#123456',
          fill: 'none',
        },
      },
    });

    const options = getFreehandPluginOptions(board);

    expect(options.themeColors[ThemeColorMode.default].strokeColor).toBe('#123456');
    expect(options.themeColors[ThemeColorMode.dark].strokeColor).toBe('#FFFFFF');
  });
});
