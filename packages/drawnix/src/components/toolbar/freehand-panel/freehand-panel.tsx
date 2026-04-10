import classNames from 'classnames';
import { Island } from '../../island';
import Stack from '../../stack';
import { ToolButton } from '../../tool-button';
import { BoardTransforms, PlaitBoard } from '@plait/core';
import React from 'react';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { useBoard } from '@plait-board/react-board';
import { DrawnixPointerType } from '../../../hooks/use-drawnix';
import { useI18n } from '../../../i18n';
import { FreehandShape } from '../../../plugins/freehand/type';
import {
  FREEHANDS,
  FREEHAND_PRESET_IDS,
  type FreehandPresetId,
} from '../../../constants/freehand';
import {
  FreehandStylePresetItem,
  type FreehandStylePreset,
} from './freehand-style-preset-item';
import './freehand-style-preset-item.scss';
import {
  DEFAULT_FREEHAND_PRESETS,
  type FreehandDrawOptions,
} from '../../../plugins/freehand/presets';

const FreehandStyleDivider = () => (
  <span className="freehand-style-divider" aria-hidden="true" />
);

FreehandStyleDivider.displayName = 'FreehandStyleDivider';

const getPresetId = (presetIndex: number): FreehandPresetId | string => {
  return FREEHAND_PRESET_IDS[presetIndex] || `preset-${presetIndex + 1}`;
};

const toPreset = (
  presetIndex: number,
  preset: FreehandDrawOptions
): FreehandStylePreset => ({
  id: getPresetId(presetIndex),
  color: preset.strokeColor,
  size: preset.strokeWidth,
});

export type FreehandPickerProps = {
  freehandPresets: FreehandDrawOptions[];
  activePresetIndex: number;
  onPresetSelect: (presetIndex: number) => void;
  onStrokeColorSelect: (presetIndex: number, strokeColor?: string) => void;
  onStrokeWidthSelect: (presetIndex: number, strokeWidth: number) => void;
  onPointerUp: (pointer: DrawnixPointerType) => void;
};

export const FreehandPanel: React.FC<FreehandPickerProps> = ({
  freehandPresets,
  activePresetIndex,
  onPresetSelect,
  onStrokeColorSelect,
  onStrokeWidthSelect,
  onPointerUp,
}) => {
  const { t } = useI18n();
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  const presets = freehandPresets.length
    ? freehandPresets
    : DEFAULT_FREEHAND_PRESETS;
  const showPresets = board.pointer !== FreehandShape.eraser;

  const saveAndApplyPreset = (presetIndex: number) => {
    onPresetSelect(presetIndex);
    setCreationMode(board, BoardCreationMode.drawing);
    BoardTransforms.updatePointerType(board, FreehandShape.feltTipPen);
    onPointerUp(FreehandShape.feltTipPen);
  };

  return (
    <Island padding={1}>
      <Stack.Row gap={1} align="start" className="freehand-style-list">
        {FREEHANDS.map((freehand, index) => (
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
        ))}
        {showPresets && FREEHANDS.length > 0 && presets.length > 0 && (
          <FreehandStyleDivider />
        )}
        {showPresets &&
          presets.map((preset, presetIndex) => (
            <FreehandStylePresetItem
              key={getPresetId(presetIndex)}
              preset={toPreset(presetIndex, preset)}
              selected={activePresetIndex === presetIndex}
              container={container}
              onSelect={() => {
                saveAndApplyPreset(presetIndex);
              }}
              onColorChange={(color) => {
                onStrokeColorSelect(presetIndex, color);
              }}
              onSizeChange={(size) => {
                onStrokeWidthSelect(presetIndex, size);
              }}
            />
          ))}
      </Stack.Row>
    </Island>
  );
};
