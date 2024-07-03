import classNames from 'classnames';
import { Island } from './island';
import Stack from './stack';
import { ToolButton } from './tool-button';
import { StraightArrowIcon, ElbowArrowIcon, CurveArrowIcon } from './icons';
import { useBoard } from '@plait/react-board';
import { BoardTransforms, PlaitBoard } from '@plait/core';
import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { ArrowLineShape } from '@plait/draw';

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

export const ArrowPopupContent: React.FC = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);

  const onPointerDown = (pointer: ArrowLineShape) => {
    setCreationMode(board, BoardCreationMode.drawing);
    BoardTransforms.updatePointerType(board, pointer);
  };

  const onPointerUp = () => {};

  return (
    <Popover.Portal container={container}>
      <Popover.Content sideOffset={12}>
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
                    onPointerDown(arrow.pointer);
                  }}
                  onPointerUp={() => {
                    onPointerUp();
                  }}
                />
              );
            })}
          </Stack.Row>
        </Island>
      </Popover.Content>
    </Popover.Portal>
  );
};
