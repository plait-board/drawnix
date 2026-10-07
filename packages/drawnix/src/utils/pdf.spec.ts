import { describe, expect, it } from 'vitest';
import { resolvePageLayout } from './pdf';

describe('resolvePageLayout', () => {
  it('keeps landscape dimensions by using landscape orientation', () => {
    const layout = resolvePageLayout(1200, 700);

    expect(layout.orientation).toBe('landscape');
    expect(layout.format).toEqual([1200, 700]);
  });

  it('keeps portrait dimensions by using portrait orientation', () => {
    const layout = resolvePageLayout(700, 1200);

    expect(layout.orientation).toBe('portrait');
    expect(layout.format).toEqual([700, 1200]);
  });

  it('never lets jsPDF swap the format for either aspect ratio', () => {
    // jsPDF swaps format when the orientation does not match the aspect ratio,
    // which previously truncated the right side of landscape boards.
    const landscape = resolvePageLayout(19200, 100);
    const portrait = resolvePageLayout(100, 19200);

    expect(landscape.format).toEqual([19200, 100]);
    expect(portrait.format).toEqual([100, 19200]);
  });
});
