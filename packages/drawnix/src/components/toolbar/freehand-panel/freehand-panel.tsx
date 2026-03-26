import classNames from 'classnames';
import { Island } from '../../island';
import Stack from '../../stack';
import { ToolButton } from '../../tool-button';
import { Check, EraseIcon, FeltTipPenIcon } from '../../icons';
import { BoardTransforms, DEFAULT_COLOR } from '@plait/core';
import React from 'react';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import {
  DEFAULT_FREEHAND_STROKE_WIDTH,
  FreehandShape,
} from '../../../plugins/freehand/type';
import { getFreehandDefaultStrokeColor } from '../../../plugins/freehand/utils';
import { useBoard } from '@plait-board/react-board';
import { splitRows } from '../../../utils/common';
import { DrawnixPointerType } from '../../../hooks/use-drawnix';
import { Translations, useI18n } from '../../../i18n';
import { CLASSIC_COLORS, WHITE } from '../../../constants/color';
import { isDefaultStroke, isNoColor } from '../../../utils/color';
import { FreehandWidthSlider } from './freehand-width-slider';
import './freehand-panel.scss';

export interface FreehandProps {
  titleKey: keyof Translations;
  icon: React.ReactNode;
  pointer: DrawnixPointerType;
}

export const FREEHANDS: FreehandProps[] = [
  {
    icon: FeltTipPenIcon,
    pointer: FreehandShape.feltTipPen,
    titleKey: 'toolbar.pen',
  },
  {
    icon: EraseIcon,
    pointer: FreehandShape.eraser,
    titleKey: 'toolbar.eraser',
  },
];

const ROW_FREEHANDS = splitRows(FREEHANDS, 5);

const FREEHAND_PRESET_COLORS = CLASSIC_COLORS;
const ROW_FREEHAND_PRESET_COLORS = splitRows(FREEHAND_PRESET_COLORS, 5);

export type FreehandPickerProps = {
  selectedStrokeColor: string;
  selectedStrokeWidth: number;
  onStrokeColorSelect: (strokeColor: string) => void;
  onStrokeWidthSelect: (strokeWidth: number) => void;
  onPointerUp: (pointer: DrawnixPointerType) => void;
};

export const FreehandPanel: React.FC<FreehandPickerProps> = ({
  selectedStrokeColor,
  selectedStrokeWidth,
  onStrokeColorSelect,
  onStrokeWidthSelect,
  onPointerUp,
}) => {
  const { t } = useI18n();
  const board = useBoard();
  const themeDefaultStrokeColor = getFreehandDefaultStrokeColor(
    board.theme.themeColorMode
  );
  const normalizedStrokeWidth =
    selectedStrokeWidth || DEFAULT_FREEHAND_STROKE_WIDTH;
  const previewStrokeColor = isNoColor(selectedStrokeColor)
    ? themeDefaultStrokeColor
    : selectedStrokeColor;
  return (
    <Island padding={1}>
      <Stack.Col gap={2}>
        {ROW_FREEHANDS.map((rowFreehands, rowIndex) => {
          return (
            <Stack.Row gap={1} key={rowIndex}>
              {rowFreehands.map((freehand, index) => {
                return (
                  <ToolButton
                    key={index}
                    className={classNames({ fillable: false })}
                    selected={board.pointer === freehand.pointer}
                    type="icon"
                    size={'small'}
                    visible={true}
                    icon={freehand.icon}
                    title={t(freehand.titleKey)}
                    aria-label={t(freehand.titleKey)}
                    onPointerDown={() => {
                      setCreationMode(board, BoardCreationMode.dnd);
                      BoardTransforms.updatePointerType(board, freehand.pointer);
                    }}
                    onPointerUp={() => {
                      setCreationMode(board, BoardCreationMode.drawing);
                      onPointerUp(freehand.pointer);
                    }}
                  />
                );
              })}
            </Stack.Row>
          );
        })}
        <Stack.Row gap={1} className="freehand-width-row">
          <FreehandWidthSlider
            value={normalizedStrokeWidth}
            previewColor={previewStrokeColor}
            onChange={onStrokeWidthSelect}
          />
        </Stack.Row>
        <Stack.Col gap={2}>
          {ROW_FREEHAND_PRESET_COLORS.map((colors, rowIndex) => (
            <Stack.Row gap={2} key={rowIndex}>
              {colors.map((color) => {
                const isThemeDefaultColor = isNoColor(color.value);
                const swatchColor = isThemeDefaultColor
                  ? themeDefaultStrokeColor
                  : color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    className={classNames('color-select-item', {
                      active: selectedStrokeColor === color.value,
                      'freehand-theme-default-color': isThemeDefaultColor,
                    })}
                    style={{
                      backgroundColor: swatchColor,
                      color: isDefaultStroke(swatchColor)
                        ? WHITE
                        : DEFAULT_COLOR,
                    }}
                    onClick={() => {
                      onStrokeColorSelect(color.value);
                    }}
                    title={t(color.name as keyof Translations)}
                    aria-label={t(color.name as keyof Translations)}
                  >
                    {isThemeDefaultColor && (
                      <span
                        className="freehand-theme-default-indicator"
                        aria-hidden="true"
                      ></span>
                    )}
                    {selectedStrokeColor === color.value && Check}
                  </button>
                );
              })}
            </Stack.Row>
          ))}
        </Stack.Col>
      </Stack.Col>
    </Island>
  );
};
