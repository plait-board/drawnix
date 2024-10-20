import { useState } from 'react';
import { Check, TransparentIcon } from './icons';
import Stack from '../components/stack';
import './color-picker.scss';
import { splitRows } from '../utils/common';
import {
  applyOpacityToHex,
  hexAlphaToOpacity,
  removeHexAlpha,
} from '../utils/transparency';
import React from 'react';
import { SizeSlider } from './size-slider';

const CLASSIC_COLORS = [
  { name: 'Transparent', value: 'TRANSPARENT' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Gray', value: '#808080' },
  { name: 'Deep Blue', value: '#1E90FF' },
  { name: 'Red', value: '#FF4500' },
  { name: 'Green', value: '#2ECC71' },
  { name: 'Yellow', value: '#FFD700' },
  { name: 'Purple', value: '#8A2BE2' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Pastel Pink', value: '#FFB3BA' },
  { name: 'Cyan', value: '#00CED1' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Forest Green', value: '#228B22' },
  { name: 'Light Gray', value: '#D3D3D3' },
];

const ROWS_CLASSIC_COLORS = splitRows(CLASSIC_COLORS, 4);

export type ColorPickerProps = {
  onSelect: (color: string) => void;
  currentColor?: string;
};

export const ColorPicker = React.forwardRef((props: ColorPickerProps, ref) => {
  const { onSelect, currentColor } = props;
  const [selectedColor, setSelectedColor] = useState(
    removeHexAlpha(currentColor || ROWS_CLASSIC_COLORS[0][0].value)
  );
  const [opacity, setOpacity] = useState(
    hexAlphaToOpacity(currentColor || ROWS_CLASSIC_COLORS[0][0].value)
  );
  return (
    <>
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
                    } ${color.value === 'TRANSPARENT' ? 'transparent' : ''}`}
                    style={{
                      backgroundColor: color.value,
                      color: color.value === '#000000' ? '#FFFFFF' : '#000000',
                    }}
                    onClick={() => {
                      setSelectedColor(color.value);
                      if (opacity !== 100) {
                        onSelect(applyOpacityToHex(color.value, opacity));
                      } else {
                        onSelect(color.value);
                      }
                    }}
                    title={color.name}
                  >
                    {color.value === 'TRANSPARENT' && TransparentIcon}
                    {selectedColor === color.value && Check}
                  </button>
                );
              })}
            </Stack.Row>
          ))}
        </Stack.Col>
      </Stack.Col>
    </>
  );
});
