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
import { isNoColor } from '../../../utils/color';

const formatSize = (value: number) => {
  return value.toFixed(2).replace(/\.?0+$/, '');
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
          selected={selected || open}
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
          <span
            className="freehand-style-preset__preview"
            style={{
              borderColor: swatchColor,
            }}
          >
            <span
              className="freehand-style-preset__dot"
              style={{
                backgroundColor: swatchColor,
                width: `${Math.min(Math.max(preset.size + 1, 4), 14)}px`,
                height: `${Math.min(Math.max(preset.size + 1, 4), 14)}px`,
              }}
            />
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
