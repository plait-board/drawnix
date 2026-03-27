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
  FreeHandItems,
  FreehandItem,
  FreehandPresetItem,
  FreehandToolItem,
} from '../../../constants/freehand';
import {
  FreehandStylePresetItem,
  FreehandStylePreset,
} from './freehand-style-preset-item';
import './freehand-style-preset-item.scss';

const FreehandStyleDivider = () => (
  <span className="freehand-style-divider" aria-hidden="true" />
);

FreehandStyleDivider.displayName = 'FreehandStyleDivider';

const FIRST_PRESET_ID =
  FreeHandItems.find(
    (item): item is FreehandPresetItem => item.type === 'preset'
  )?.id || '';

const isFreehandPresetItem = (item: FreehandItem): item is FreehandPresetItem =>
  item.type === 'preset';

const isFreehandToolItem = (item: FreehandItem): item is FreehandToolItem =>
  item.type === 'tool';

const toPreset = (item: FreehandPresetItem): FreehandStylePreset => ({
  id: item.id,
  color: item.color,
  size: item.size,
});

const updatePresetInItems = (
  items: FreehandItem[],
  presetId: string,
  updater: (preset: FreehandPresetItem) => FreehandPresetItem
): FreehandItem[] =>
  items.map((item) =>
    isFreehandPresetItem(item) && item.id === presetId ? updater(item) : item
  );

const getPresetItems = (items: FreehandItem[]): FreehandPresetItem[] =>
  items.filter((item): item is FreehandPresetItem =>
    isFreehandPresetItem(item)
  );
const getToolItems = (items: FreehandItem[]): FreehandToolItem[] =>
  items.filter((item): item is FreehandToolItem => isFreehandToolItem(item));

export type FreehandPickerProps = {
  onPointerUp: (pointer: DrawnixPointerType) => void;
};

export const FreehandPanel: React.FC<FreehandPickerProps> = ({
  onPointerUp,
}) => {
  const { t } = useI18n();
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  const [items, setItems] = React.useState<FreehandItem[]>(FreeHandItems);
  const [activePresetId, setActivePresetId] =
    React.useState<string>(FIRST_PRESET_ID);
  const toolItems = getToolItems(items);
  const presetItems = getPresetItems(items);
  const showPresets = board.pointer !== FreehandShape.eraser;

  const saveAndApplyPreset = (preset: FreehandPresetItem) => {
    // do nothing now
  };

  return (
    <Island padding={1}>
      <Stack.Row gap={1} align="start" className="freehand-style-list">
        {toolItems.map((freehand, index) => (
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
        {showPresets && toolItems.length > 0 && presetItems.length > 0 && (
          <FreehandStyleDivider />
        )}
        {showPresets &&
          presetItems.map((preset) => (
          <FreehandStylePresetItem
            key={preset.id}
            preset={toPreset(preset)}
            selected={activePresetId === preset.id}
            container={container}
            onSelect={() => {
              setActivePresetId(preset.id);
              saveAndApplyPreset(preset);
            }}
            onColorChange={(color) => {
              setItems((value) =>
                updatePresetInItems(value, preset.id, (item) => ({
                  ...item,
                  color,
                }))
              );
            }}
            onSizeChange={(size) => {
              setItems((value) =>
                updatePresetInItems(value, preset.id, (item) => ({
                  ...item,
                  size,
                }))
              );
            }}
          />
        ))}
      </Stack.Row>
    </Island>
  );
};
