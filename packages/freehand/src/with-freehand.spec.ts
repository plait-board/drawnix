import { createTestingBoard, withOptions } from '@plait/core';
import { withDraw } from '@plait/draw';
import { describe, expect, it } from 'vitest';
import { getFreehandDrawOptions } from './utils';
import { createFreehandPlugin } from './with-freehand';

describe('createFreehandPlugin', () => {
  it('composes with a real Plait board and applies consumer options', () => {
    const board = createTestingBoard(
      [
        withOptions,
        withDraw,
        createFreehandPlugin({
          getDrawOptions: () => ({
            strokeColor: '#123456',
            strokeWidth: 4,
          }),
        }),
      ],
      []
    );

    expect(getFreehandDrawOptions(board)).toEqual({
      strokeColor: '#123456',
      strokeWidth: 4,
    });
  });
});
