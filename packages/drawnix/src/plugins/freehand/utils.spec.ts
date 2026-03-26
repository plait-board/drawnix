import {
  DEFAULT_FREEHAND_STROKE_WIDTH,
  resolveFreehandDrawOptions,
} from './presets';

describe('freehand utils', () => {
  it('keeps explicit stroke presets', () => {
    expect(
      resolveFreehandDrawOptions({
        strokeColor: '#FF4500',
        strokeWidth: 4,
      })
    ).toEqual({
      strokeColor: '#FF4500',
      strokeWidth: 4,
    });
  });

  it('falls back to themed defaults when preset color is default', () => {
    expect(
      resolveFreehandDrawOptions({
        strokeColor: 'NO_COLOR',
        strokeWidth: DEFAULT_FREEHAND_STROKE_WIDTH,
      })
    ).toEqual({});
  });
});
