import { toImage } from '@plait/core';
import { describe, expect, it, vi } from 'vitest';
import { boardToImage } from './common';

vi.mock('@plait/core', () => ({
  IS_APPLE: false,
  IS_MAC: false,
  toImage: vi.fn(),
}));

describe('boardToImage', () => {
  it('inlines Slate text color styles for exports', () => {
    const board = {} as any;

    boardToImage(board);

    expect(toImage).toHaveBeenCalledWith(
      board,
      expect.objectContaining({
        inlineStyleClassNames: expect.stringContaining('[data-slate-leaf]'),
        styleNames: expect.arrayContaining(['color']),
      })
    );
  });
});
