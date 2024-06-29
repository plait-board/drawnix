import classNames from 'classnames';
import { Island } from './island';
import Stack from './stack';
import { ToolButton } from './tool-button';
import {
  HandIcon,
  MindIcon,
  SelectionIcon,
  ShapeIcon,
  TextIcon,
  StraightArrowLineIcon,
  RectangleIcon,
  EllipseIcon,
  TriangleIcon,
  DiamondIcon,
  ParallelogramIcon,
  RoundRectangleIcon,
} from './icons';
import { useBoard } from '@plait/react-board';
import { BoardTransforms, PlaitBoard } from '@plait/core';
import * as Popover from '@radix-ui/react-popover';

import './shape-picker.scss';
import React from 'react';
import { DrawnixPointerType } from '../drawnix';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { BasicShapes, DrawPointerType } from '@plait/draw';

export interface ShapeProps {
  icon: React.ReactNode;
  title: string;
  pointer: DrawPointerType;
}

const splitRows = (shapes: ShapeProps[], cols: number) => {
  let result = [];
  for (let i = 0; i < shapes.length; i += cols) {
    result.push(shapes.slice(i, i + cols));
  }
  return result;
};

const SHAPES: ShapeProps[] = [
  {
    icon: RectangleIcon,
    title: 'Rectangle',
    pointer: BasicShapes.rectangle,
  },
  {
    icon: EllipseIcon,
    title: 'Ellipse',
    pointer: BasicShapes.ellipse,
  },
  {
    icon: TriangleIcon,
    title: 'Triangle',
    pointer: BasicShapes.triangle,
  },
  {
    icon: DiamondIcon,
    title: 'Diamond',
    pointer: BasicShapes.diamond,
  },
  {
    icon: ParallelogramIcon,
    title: 'Parallelogram',
    pointer: BasicShapes.parallelogram,
  },
  {
    icon: RoundRectangleIcon,
    title: 'RoundRectangle',
    pointer: BasicShapes.roundRectangle,
  },
];

const ROW_SHAPES = splitRows(SHAPES, 5);

export type ShapePickerProps = {};

export const ShapePickerPopupContent: React.FC<ShapePickerProps> = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);

  const onPointerDown = (pointer: DrawnixPointerType) => {
    setCreationMode(board, BoardCreationMode.dnd);
    BoardTransforms.updatePointerType(board, pointer);
    // setPointer(pointer);
  };

  const onPointerUp = () => {
    setCreationMode(board, BoardCreationMode.drawing);
  };

  return (
    <Popover.Portal container={container}>
      <Popover.Content sideOffset={12}>
        <Island padding={1}>
          <Stack.Col gap={1}>
            {ROW_SHAPES.map((shapes, rowIndex) => {
              return (
                <Stack.Row gap={1} key={rowIndex}>
                  {shapes.map((shape, index) => {
                    return (
                      <ToolButton
                        key={index}
                        className={classNames('Shape', { fillable: false })}
                        type="icon"
                        size={'small'}
                        visible={true}
                        icon={shape.icon}
                        title={shape.title}
                        aria-label={shape.title}
                        onPointerDown={() => {
                          onPointerDown(shape.pointer);
                        }}
                        onPointerUp={() => {
                          onPointerUp();
                        }}
                      />
                    );
                  })}
                </Stack.Row>
              );
            })}
          </Stack.Col>
        </Island>
      </Popover.Content>
    </Popover.Portal>
  );
};
