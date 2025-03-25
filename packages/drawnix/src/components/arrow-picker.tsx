import classNames from 'classnames';
import { Island } from './island';
import Stack from './stack';
import { ToolButton } from './tool-button';
import { StraightArrowIcon, ElbowArrowIcon, CurveArrowIcon } from './icons';
import { useBoard } from '@plait-board/react-board';
import { BoardTransforms } from '@plait/core';
import React from 'react';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { ArrowLineShape, DrawPointerType } from '@plait/draw';

export interface ArrowProps {
  icon: React.ReactNode;
  title: string;
  pointer: ArrowLineShape;
}

const ARROWS: ArrowProps[] = [
  {
    icon: StraightArrowIcon,
    title: 'Straight Arrow Line',
    pointer: ArrowLineShape.straight,
  },
  {
    icon: ElbowArrowIcon,
    title: 'Elbow Arrow Line',
    pointer: ArrowLineShape.elbow,
  },
  {
    icon: CurveArrowIcon,
    title: 'Curve Arrow Line',
    pointer: ArrowLineShape.curve,
  },
];

export type ArrowPickerProps = {
  onPointerUp: (pointer: DrawPointerType) => void;
};

export const ArrowPicker: React.FC<ArrowPickerProps> = ({ onPointerUp }) => {
  const board = useBoard();
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
              icon={arrow.icon}
              title={arrow.title}
              aria-label={arrow.title}
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
