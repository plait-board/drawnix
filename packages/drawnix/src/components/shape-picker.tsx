import classNames from 'classnames';
import { Island } from './island';
import Stack from './stack';
import { ToolButton } from './tool-button';
import {
  RectangleIcon,
  EllipseIcon,
  TriangleIcon,
  DiamondIcon,
  ParallelogramIcon,
  RoundRectangleIcon,
  TerminalIcon,
} from './icons';
import { BoardTransforms } from '@plait/core';
import React from 'react';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { BasicShapes, DrawPointerType, FlowchartSymbols } from '@plait/draw';
import { useBoard } from '@plait/react-board';
import { splitRows } from '../utils/common';

export interface ShapeProps {
  icon: React.ReactNode;
  title: string;
  pointer: DrawPointerType;
}

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
    icon: TerminalIcon,
    title: 'Terminal',
    pointer: FlowchartSymbols.terminal,
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

export type ShapePickerProps = {
  onPointerUp: (pointer: DrawPointerType) => void;
};

export const ShapePicker: React.FC<ShapePickerProps> = ({
  onPointerUp,
}) => {
  const board = useBoard();
  return (
    <Island padding={1}>
      <Stack.Col gap={1}>
        {ROW_SHAPES.map((rowShapes, rowIndex) => {
          return (
            <Stack.Row gap={1} key={rowIndex}>
              {rowShapes.map((shape, index) => {
                return (
                  <ToolButton
                    key={index}
                    className={classNames({ fillable: false })}
                    type="icon"
                    size={'small'}
                    visible={true}
                    icon={shape.icon}
                    title={shape.title}
                    aria-label={shape.title}
                    onPointerDown={() => {
                      setCreationMode(board, BoardCreationMode.dnd);
                      BoardTransforms.updatePointerType(board, shape.pointer);
                    }}
                    onPointerUp={() => {
                      setCreationMode(board, BoardCreationMode.drawing);
                      onPointerUp(shape.pointer);
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
