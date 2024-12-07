import { useState } from 'react';
import { Check, NoColorIcon } from './icons';
import Stack from '../components/stack';
import './color-picker.scss';
import { splitRows } from '../utils/common';
import {
  applyOpacityToHex,
  hexAlphaToOpacity,
  isDefaultStroke,
  isNoColor,
  removeHexAlpha,
} from '../utils/color';
import React from 'react';
import { SizeSlider } from './size-slider';
import {
  CLASSIC_COLORS,
  NO_COLOR,
  TRANSPARENT,
  WHITE,
} from '../constants/color';
import { DEFAULT_COLOR } from '@plait/core';

const ROWS_CLASSIC_COLORS = splitRows(CLASSIC_COLORS, 4);

export type ColorPickerProps = {
  onSelect: (color: string) => void;
  currentColor?: string;
};

export const ColorPicker = React.forwardRef((props: ColorPickerProps, ref) => {
  const { onSelect, currentColor } = props;
  const [selectedColor, setSelectedColor] = useState(
    (currentColor && removeHexAlpha(currentColor)) ||
      ROWS_CLASSIC_COLORS[0][0].value
  );
  const [opacity, setOpacity] = useState(
    (currentColor && hexAlphaToOpacity(currentColor)) || 100
  );
  return (
    <Stack.Col gap={3}>
        <SizeSlider
          step={5}
          defaultValue={opacity}
          onChange={(value) => {
            setOpacity(value);
            onSelect(applyOpacityToHex(selectedColor, value));
          }}
          disabled={selectedColor === CLASSIC_COLORS[0]['value']}
        ></SizeSlider>
        <Stack.Col gap={2}>
          {ROWS_CLASSIC_COLORS.map((colors, index) => (
            <Stack.Row key={index} gap={2}>
              {colors.map((color) => {
                return (
                  <button
                    key={color.value}
                    className={`color-select-item ${
                      selectedColor === color.value ? 'active' : ''
                    } ${isNoColor(color.value) ? 'no-color' : ''}`}
                    style={{
                      backgroundColor: isNoColor(color.value)
                        ? TRANSPARENT
                        : color.value,
                      color: isDefaultStroke(color.value)
                        ? WHITE
                        : DEFAULT_COLOR,
                    }}
                    onClick={() => {
                      setSelectedColor(color.value);
                      if (color.value === NO_COLOR) {
                        setOpacity(100);
                        onSelect(color.value);
                        return;
                      }
                      if (opacity !== 100) {
                        onSelect(applyOpacityToHex(color.value, opacity));
                      } else {
                        onSelect(color.value);
                      }
                    }}
                    title={color.name}
                  >
                    {isNoColor(color.value) && NoColorIcon}
                    {selectedColor === color.value && Check}
                  </button>
                );
              })}
            </Stack.Row>
          ))}
        </Stack.Col>
      </Stack.Col>
  );
});
