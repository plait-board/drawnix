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

export interface FreehandProps {
    title: string;
    icon: React.ReactNode;
    pointer: DrawnixPointerType;
}

const FREEHANDS: FreehandProps[] = [
  {
      icon: FeltTipPenIcon,
      pointer: FreehandShape.feltTipPen,
      title: 'toolbar.pen',
    },
    {
      icon: EraseIcon,
      pointer: FreehandShape.eraser,
      title: 'toolbar.eraser',
    },
];

const ROW_FREEHANDS = splitRows(FREEHANDS, 5);

export type FreehandPickerProps = {
  onPointerUp: (pointer: DrawnixPointerType) => void;
};

export const FreehandPanel: React.FC<FreehandPickerProps> = ({
  onPointerUp,
}) => {
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
                    type="icon"
                    size={'small'}
                    visible={true}
                    icon={freehand.icon}
                    title={freehand.title}
                    aria-label={freehand.title}
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
