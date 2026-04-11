import type * as PresetsModule from './presets';

jest.mock('@plait/core', () => ({
  DEFAULT_COLOR: '#000000',
}));

const { resolveFreehandDrawOptions } =
  jest.requireActual<typeof PresetsModule>('./presets');

describe('freehand utils', () => {
  it('preserves theme-following presets when color is omitted', () => {
    expect(
      resolveFreehandDrawOptions({
        strokeWidth: 2,
      })
    ).toEqual({
      strokeWidth: 2,
    });
  });

  it('keeps explicit stroke presets', () => {
    expect(
      resolveFreehandDrawOptions({
        strokeColor: '#FF4500',
        strokeWidth: 3.25,
      })
    ).toEqual({
      strokeColor: '#FF4500',
      strokeWidth: 3.25,
    });
  });

  it('keeps explicit default-like preset values', () => {
    expect(
      resolveFreehandDrawOptions({
        strokeColor: '#000000',
        strokeWidth: 2,
      })
    ).toEqual({
      strokeColor: '#000000',
      strokeWidth: 2,
    });
  });
});
