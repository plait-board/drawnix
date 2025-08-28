import classNames from 'classnames';
import { Island } from '../../island';
import Stack from '../../stack';
import { ToolButton } from '../../tool-button';
import {
  EraseIcon,
  FeltTipPenIcon,
} from '../../icons';
import { BoardTransforms } from '@plait/core';
import React from 'react';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { FreehandShape } from '../../../plugins/freehand/type';
import { useBoard } from '@plait-board/react-board';
import { splitRows } from '../../../utils/common';
import {
    DrawnixPointerType,
} from '../../../hooks/use-drawnix';
import { useI18n } from '../../../i18n';

export interface FreehandProps {
    titleKey: string;
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

export type FreehandPickerProps = {
  onPointerUp: (pointer: DrawnixPointerType) => void;
};

export const FreehandPanel: React.FC<FreehandPickerProps> = ({
  onPointerUp,
}) => {
  const { t } = useI18n();
  const board = useBoard();
  return (
    <Island padding={1}>
      <Stack.Col gap={1}>
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
      </Stack.Col>
    </Island>
  );
};
