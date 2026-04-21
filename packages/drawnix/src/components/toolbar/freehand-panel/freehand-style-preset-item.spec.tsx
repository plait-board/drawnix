import React from 'react';
import { render } from '@testing-library/react';
import {
  FreehandStylePresetItem,
  getFreehandPreviewRadius,
  type FreehandStylePresetItemProps,
} from './freehand-style-preset-item';

jest.mock('../../../i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@plait-board/react-board', () => ({
  useBoard: () => ({
    theme: {
      themeColorMode: 'light',
    },
  }),
}));

jest.mock('../../../plugins/freehand/utils', () => ({
  getFreehandDefaultStrokeColor: () => '#000000',
}));

jest.mock('../../../plugins/freehand/type', () => ({
  FREEHAND_STROKE_WIDTH_STEP: 0.25,
  MAX_FREEHAND_STROKE_WIDTH: 12,
  MIN_FREEHAND_STROKE_WIDTH: 1,
}));

jest.mock('../../../utils/color', () => ({
  isNoColor: () => false,
  isWhite: (color?: string) =>
    color === '#FFFFFF' || color === '#ffffff',
}));

jest.mock('../../tool-button', () => ({
  ToolButton: ({ children, className, selected, ...props }: any) => (
    <button
      type="button"
      aria-label={props['aria-label']}
      className={[className, selected ? 'tool-icon--selected' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../popover/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children }: any) => <>{children}</>,
}));

jest.mock('../../island', () => ({
  Island: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../stack', () => ({
  __esModule: true,
  default: {
    Col: ({ children }: any) => <div>{children}</div>,
  },
}));

jest.mock('../../size-slider', () => ({
  SizeSlider: () => null,
}));

jest.mock('../../color-picker', () => ({
  ColorPicker: () => null,
}));

const createProps = (
  overrides: Partial<FreehandStylePresetItemProps> = {}
): FreehandStylePresetItemProps => ({
  preset: {
    id: 'preset-1',
    color: '#FF4500',
    size: 1,
  },
  selected: false,
  container: null,
  onSelect: jest.fn(),
  onColorChange: jest.fn(),
  onSizeChange: jest.fn(),
  ...overrides,
});

describe('getFreehandPreviewRadius', () => {
  it('maps the minimum stroke width to the minimum preview radius', () => {
    expect(getFreehandPreviewRadius(1)).toBeCloseTo(2);
  });

  it('maps the maximum stroke width to the maximum preview radius', () => {
    expect(getFreehandPreviewRadius(12)).toBeCloseTo(5.5);
  });

  it('clamps out-of-range stroke widths', () => {
    expect(getFreehandPreviewRadius(0)).toBeCloseTo(2);
    expect(getFreehandPreviewRadius(20)).toBeCloseTo(5.5);
  });

  it('increases monotonically across the supported stroke-width range', () => {
    expect(getFreehandPreviewRadius(3)).toBeLessThan(getFreehandPreviewRadius(6));
    expect(getFreehandPreviewRadius(6)).toBeLessThan(
      getFreehandPreviewRadius(9)
    );
  });
});

describe('FreehandStylePresetItem', () => {
  it('renders the preview ring and fill at the expected center point', () => {
    const { container } = render(<FreehandStylePresetItem {...createProps()} />);

    const base = container.querySelector('.freehand-style-preset__preview-base');
    const ring = container.querySelector('.freehand-style-preset__preview-ring');
    const fill = container.querySelector('.freehand-style-preset__preview-fill');

    expect(base).not.toBeNull();
    expect(ring).not.toBeNull();
    expect(fill).not.toBeNull();
    expect(container.querySelectorAll('circle')).toHaveLength(3);
    expect(base?.getAttribute('cx')).toBe('8');
    expect(base?.getAttribute('cy')).toBe('8');
    expect(base?.getAttribute('stroke')).toBe('none');
    expect(ring?.getAttribute('cx')).toBe('8');
    expect(ring?.getAttribute('cy')).toBe('8');
    expect(fill?.getAttribute('cx')).toBe('8');
    expect(fill?.getAttribute('cy')).toBe('8');
    expect(fill?.getAttribute('stroke')).toBe('none');
    expect(ring?.getAttribute('stroke')).toBe('#FF4500');
  });

  it('updates only the fill radius when the preset size changes', () => {
    const { container, rerender } = render(
      <FreehandStylePresetItem {...createProps()} />
    );

    const initialFill = container.querySelector(
      '.freehand-style-preset__preview-fill'
    );
    const initialRadius = initialFill?.getAttribute('r');
    const initialCenterX = initialFill?.getAttribute('cx');
    const initialCenterY = initialFill?.getAttribute('cy');

    rerender(
      <FreehandStylePresetItem
        {...createProps({
          preset: {
            id: 'preset-1',
            color: '#FF4500',
            size: 12,
          },
        })}
      />
    );

    const nextFill = container.querySelector('.freehand-style-preset__preview-fill');

    expect(nextFill?.getAttribute('cx')).toBe(initialCenterX);
    expect(nextFill?.getAttribute('cy')).toBe(initialCenterY);
    expect(nextFill?.getAttribute('r')).not.toBe(initialRadius);
    expect(nextFill?.getAttribute('r')).toBe(
      `${getFreehandPreviewRadius(12)}`
    );
  });

  it('renders a dedicated white contrast structure without the standard color ring', () => {
    const { container } = render(
      <FreehandStylePresetItem
        {...createProps({
          preset: {
            id: 'preset-1',
            color: '#FFFFFF',
            size: 4,
          },
        })}
      />
    );

    const contrastRing = container.querySelector(
      '.freehand-style-preset__preview-ring-contrast'
    );
    const contrastFill = container.querySelector(
      '.freehand-style-preset__preview-fill-contrast'
    );

    expect(container.querySelectorAll('circle')).toHaveLength(3);
    expect(contrastRing).not.toBeNull();
    expect(contrastRing?.getAttribute('stroke-width')).toBe('1');
    expect(contrastFill).not.toBeNull();
    expect(contrastFill?.getAttribute('stroke-width')).toBe('1');
    expect(contrastFill?.getAttribute('fill')).toBe('#FFFFFF');
    expect(
      container.querySelector('.freehand-style-preset__preview-ring')
    ).toBeNull();
    expect(
      container.querySelector('.freehand-style-preset__preview-fill')
    ).toBeNull();
  });

  it('keeps the non-white outer ring color unchanged when selected', () => {
    const { container } = render(
      <FreehandStylePresetItem
        {...createProps({
          selected: true,
        })}
      />
    );

    const ring = container.querySelector('.freehand-style-preset__preview-ring');

    expect(container.querySelector('.tool-icon--selected')).not.toBeNull();
    expect(container.querySelectorAll('circle')).toHaveLength(3);
    expect(ring?.getAttribute('stroke')).toBe('#FF4500');
  });

  it('keeps the white preset outer ring gray when selected', () => {
    const { container } = render(
      <FreehandStylePresetItem
        {...createProps({
          selected: true,
          preset: {
            id: 'preset-1',
            color: '#FFFFFF',
            size: 4,
          },
        })}
      />
    );

    const contrastRing = container.querySelector(
      '.freehand-style-preset__preview-ring-contrast'
    );
    const contrastFill = container.querySelector(
      '.freehand-style-preset__preview-fill-contrast'
    );

    expect(container.querySelectorAll('circle')).toHaveLength(3);
    expect(contrastRing?.getAttribute('stroke')).toBe('var(--color-gray-30)');
    expect(contrastRing?.getAttribute('stroke-width')).toBe('1');
    expect(contrastFill?.getAttribute('stroke')).toBe('var(--color-gray-30)');
    expect(contrastFill?.getAttribute('stroke-width')).toBe('1');
  });
});
