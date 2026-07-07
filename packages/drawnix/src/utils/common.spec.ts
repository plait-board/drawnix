import { describe, expect, it, vi } from 'vitest';
import { toImage } from '@plait/core';
import { boardToImage } from './common';

vi.mock('@plait/core', () => ({
  IS_APPLE: false,
  IS_MAC: false,
  toImage: vi.fn(),
}));

describe('boardToImage', () => {
  it('inlines text container styles when exporting images', () => {
    boardToImage({} as any);

    expect(toImage).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        inlineStyleClassNames: expect.stringContaining('.plait-text-container'),
      })
    );
    expect(toImage).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        inlineStyleClassNames: expect.stringContaining('.slate-editable-container'),
      })
    );
  });
});
