import { useState } from 'react';
import { Check, NoColorIcon } from './icons';
import Stack from '../components/stack';
import './color-picker.scss';
import { splitRows } from '../utils/common';
import {
  hexAlphaToOpacity,
  isDefaultStroke,
  isNoColor,
  removeHexAlpha,
} from '../utils/color';
import React from 'react';
import { SizeSlider } from './size-slider';
import {
  DEFAULT_COLOR,
  isNullOrUndefined,
  MERGING,
  PlaitHistoryBoard,
} from '@plait/core';
import {
  CLASSIC_COLORS,
  NO_COLOR,
  TRANSPARENT,
  WHITE,
} from '../constants/color';
import { useBoard } from '@plait/react-board';

const ROWS_CLASSIC_COLORS = splitRows(CLASSIC_COLORS, 4);

export type ColorPickerProps = {
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  currentColor?: string;
};

export const ColorPicker = React.forwardRef((props: ColorPickerProps, ref) => {
  const board = useBoard();
  const { currentColor, onColorChange, onOpacityChange } = props;
  const [selectedColor, setSelectedColor] = useState(
    (currentColor && removeHexAlpha(currentColor)) ||
      ROWS_CLASSIC_COLORS[0][0].value
  );
  const [opacity, setOpacity] = useState(() => {
    const _opacity = currentColor && hexAlphaToOpacity(currentColor);
    return (!isNullOrUndefined(_opacity) ? _opacity : 100) as number;
  });
  return (
    <>
      <Stack.Col gap={3}>
        <SizeSlider
          step={5}
          defaultValue={opacity}
          onChange={(value) => {
            setOpacity(value);
            onOpacityChange(value);
          }}
          beforeStart={() => {
            MERGING.set(board, true);
            PlaitHistoryBoard.setSplittingOnce(board, true);
          }}
          afterEnd={() => {
            MERGING.set(board, false);
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
                      }
                      onColorChange(color.value);
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
    </>
  );
});
