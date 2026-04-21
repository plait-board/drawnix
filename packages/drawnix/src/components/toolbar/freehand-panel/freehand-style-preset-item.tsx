import React from 'react';
import classNames from 'classnames';
import { ToolButton } from '../../tool-button';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import { Island } from '../../island';
import Stack from '../../stack';
import { SizeSlider } from '../../size-slider';
import { useI18n } from '../../../i18n';
import { ColorPicker } from '../../color-picker';
import { useBoard } from '@plait-board/react-board';
import { getFreehandDefaultStrokeColor } from '../../../plugins/freehand/utils';
import {
  FREEHAND_STROKE_WIDTH_STEP,
  MAX_FREEHAND_STROKE_WIDTH,
  MIN_FREEHAND_STROKE_WIDTH,
} from '../../../plugins/freehand/type';
import { isNoColor, isWhite } from '../../../utils/color';

const formatSize = (value: number) => {
  return value.toFixed(2).replace(/\.?0+$/, '');
};

const FREEHAND_PREVIEW_VIEWBOX_SIZE = 16;
const FREEHAND_PREVIEW_CENTER = FREEHAND_PREVIEW_VIEWBOX_SIZE / 2;
const FREEHAND_PREVIEW_OUTER_RADIUS = 7;
const FREEHAND_PREVIEW_MIN_RADIUS = 2;
const FREEHAND_PREVIEW_MAX_RADIUS = 5.5;
const FREEHAND_PREVIEW_CONTRAST_RING_COLOR = 'var(--color-gray-30)';

export const getFreehandPreviewRadius = (strokeWidth: number) => {
  const clampedStrokeWidth = Math.min(
    Math.max(strokeWidth, MIN_FREEHAND_STROKE_WIDTH),
    MAX_FREEHAND_STROKE_WIDTH
  );
  const normalizedStrokeWidth =
    (clampedStrokeWidth - MIN_FREEHAND_STROKE_WIDTH) /
    (MAX_FREEHAND_STROKE_WIDTH - MIN_FREEHAND_STROKE_WIDTH);

  return (
    FREEHAND_PREVIEW_MIN_RADIUS +
    normalizedStrokeWidth *
      (FREEHAND_PREVIEW_MAX_RADIUS - FREEHAND_PREVIEW_MIN_RADIUS)
  );
};

export interface FreehandStylePreset {
  id: string;
  color?: string;
  size: number;
}

export interface FreehandStylePresetItemProps {
  preset: FreehandStylePreset;
  selected: boolean;
  container: HTMLElement | null;
  onSelect: () => void;
  onColorChange: (color?: string) => void;
  onSizeChange: (size: number) => void;
}

export const FreehandStylePresetItem: React.FC<FreehandStylePresetItemProps> = ({
  preset,
  selected,
  container,
  onSelect,
  onColorChange,
  onSizeChange,
}) => {
  const { t } = useI18n();
  const board = useBoard();
  const [open, setOpen] = React.useState(false);
  const swatchColor =
    preset.color || getFreehandDefaultStrokeColor(board.theme.themeColorMode);
  const shouldAddWhitePresetContrast = isWhite(swatchColor);
  const previewRadius = getFreehandPreviewRadius(preset.size);
  const isActive = selected || open;

  React.useEffect(() => {
    if (!selected) {
      setOpen(false);
    }
  }, [selected]);

  return (
    <Popover
      open={open}
      sideOffset={12}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          onSelect();
          setOpen(true);
          return;
        }
        setOpen(false);
      }}
    >
      <PopoverTrigger asChild>
        <ToolButton
          className={classNames('freehand-style-preset')}
          selected={isActive}
          type="button"
          size="small"
          visible={true}
          aria-label={`${t('toolbar.pen')} ${preset.id}`}
          onPointerUp={() => {
            if (selected) {
              setOpen(!open);
              return;
            }
            onSelect();
            setOpen(false);
          }}
        >
          <span className="freehand-style-preset__preview">
            <svg
              className="freehand-style-preset__preview-svg"
              viewBox={`0 0 ${FREEHAND_PREVIEW_VIEWBOX_SIZE} ${FREEHAND_PREVIEW_VIEWBOX_SIZE}`}
              aria-hidden="true"
              focusable="false"
            >
              <circle
                className="freehand-style-preset__preview-base"
                cx={FREEHAND_PREVIEW_CENTER}
                cy={FREEHAND_PREVIEW_CENTER}
                r={FREEHAND_PREVIEW_OUTER_RADIUS + 0.5}
                stroke="none"
              />
              {shouldAddWhitePresetContrast ? (
                <>
                  <circle
                    className="freehand-style-preset__preview-ring-contrast"
                    cx={FREEHAND_PREVIEW_CENTER}
                    cy={FREEHAND_PREVIEW_CENTER}
                    r={FREEHAND_PREVIEW_OUTER_RADIUS}
                    fill="none"
                    stroke={FREEHAND_PREVIEW_CONTRAST_RING_COLOR}
                    strokeWidth={1}
                  />
                  <circle
                    className="freehand-style-preset__preview-fill-contrast"
                    cx={FREEHAND_PREVIEW_CENTER}
                    cy={FREEHAND_PREVIEW_CENTER}
                    r={previewRadius}
                    fill={swatchColor}
                    stroke={FREEHAND_PREVIEW_CONTRAST_RING_COLOR}
                    strokeWidth={1}
                  />
                </>
              ) : (
                <>
                  <circle
                    className="freehand-style-preset__preview-ring"
                    cx={FREEHAND_PREVIEW_CENTER}
                    cy={FREEHAND_PREVIEW_CENTER}
                    r={FREEHAND_PREVIEW_OUTER_RADIUS}
                    fill="none"
                    stroke={swatchColor}
                    strokeWidth={1}
                  />
                  <circle
                    className="freehand-style-preset__preview-fill"
                    cx={FREEHAND_PREVIEW_CENTER}
                    cy={FREEHAND_PREVIEW_CENTER}
                    r={previewRadius}
                    fill={swatchColor}
                    stroke="none"
                  />
                </>
              )}
            </svg>
          </span>
        </ToolButton>
      </PopoverTrigger>
      <PopoverContent container={container}>
        <Island padding={4} className="freehand-style-setting">
          <Stack.Col gap={3}>
            <SizeSlider
              title={formatSize(preset.size)}
              min={MIN_FREEHAND_STROKE_WIDTH}
              max={MAX_FREEHAND_STROKE_WIDTH}
              step={FREEHAND_STROKE_WIDTH_STEP}
              defaultValue={preset.size}
              variant="neutral"
              compact={true}
              onChange={(value) => {
                onSizeChange(value);
              }}
            />
            <ColorPicker
              currentColor={preset.color}
              hideOpacitySlider={true}
              onColorChange={(selectedColor: string) => {
                onColorChange(
                  isNoColor(selectedColor) ? undefined : selectedColor
                );
              }}
              onOpacityChange={() => {
                return;
              }}
            ></ColorPicker>
          </Stack.Col>
        </Island>
      </PopoverContent>
    </Popover>
  );
};
