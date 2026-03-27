import React from 'react';
import classNames from 'classnames';
import { ToolButton } from '../../tool-button';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import { Island } from '../../island';
import Stack from '../../stack';
import { SizeSlider } from '../../size-slider';
import { useI18n } from '../../../i18n';
import { ColorPicker } from '../../color-picker';

export interface FreehandStylePreset {
  id: string;
  color: string;
  size: number;
}

export interface FreehandStylePresetItemProps {
  preset: FreehandStylePreset;
  selected: boolean;
  container: HTMLElement | null;
  onSelect: () => void;
  onColorChange: (color: string) => void;
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
  const [open, setOpen] = React.useState(false);

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
              borderColor: preset.color,
            }}
          >
            <span
              className="freehand-style-preset__dot"
              style={{
                backgroundColor: preset.color,
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
              title={t('popupToolbar.stroke')}
              min={1}
              max={24}
              step={1}
              defaultValue={preset.size}
              onChange={(value) => {
                onSizeChange(value);
              }}
            />
            <ColorPicker
              currentColor={preset.color}
              hideOpacitySlider={true}
              onColorChange={(selectedColor: string) => {
                onColorChange(selectedColor);
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
