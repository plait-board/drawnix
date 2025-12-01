import classNames from 'classnames';
import { Island } from './island';
import Stack from './stack';
import { ToolButton } from './tool-button';
import { StraightArrowIcon, ElbowArrowIcon, CurveArrowIcon } from './icons';
import { useBoard } from '@plait-board/react-board';
import { Translations, useI18n } from '../i18n';
import { BoardTransforms , PlaitBoard } from '@plait/core';
import React from 'react';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { ArrowLineShape, DrawPointerType } from '@plait/draw';

export interface ArrowProps {
  icon: React.ReactNode;
  title: string;
  pointer: ArrowLineShape;
}

export const ARROWS: ArrowProps[] = [
  {
    icon: StraightArrowIcon,
    title: 'toolbar.arrow.straight',
    pointer: ArrowLineShape.straight,
  },
  {
    icon: ElbowArrowIcon,
    title: 'toolbar.arrow.elbow',
    pointer: ArrowLineShape.elbow,
  },
  {
    icon: CurveArrowIcon,
    title: 'toolbar.arrow.curve',
    pointer: ArrowLineShape.curve,
  },
];

export type ArrowPickerProps = {
  onPointerUp: (pointer: DrawPointerType) => void;
};

export const ArrowPicker: React.FC<ArrowPickerProps> = ({ onPointerUp }) => {
  const board = useBoard();
  const { t } = useI18n();
  return (
    <Island padding={1}>
      <Stack.Row gap={1}>
        {ARROWS.map((arrow, index) => {
          return (
            <ToolButton
              key={index}
              className={classNames({ fillable: false })}
              type="icon"
              size={'small'}
              visible={true}
              selected={PlaitBoard.isPointer(board, arrow.pointer)}
              icon={arrow.icon}
              title={t(arrow.title as keyof Translations)}
              aria-label={t(arrow.title as keyof Translations)}
              onPointerDown={() => {
                setCreationMode(board, BoardCreationMode.drawing);
                BoardTransforms.updatePointerType(board, arrow.pointer);
              }}
              onPointerUp={() => {
                onPointerUp(arrow.pointer);
              }}
            />
          );
        })}
      </Stack.Row>
    </Island>
  );
};
