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
import { BoardTransforms , PlaitBoard } from '@plait/core';
import React from 'react';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { BasicShapes, DrawPointerType, FlowchartSymbols } from '@plait/draw';
import { useBoard } from '@plait-board/react-board';
import { Translations, useI18n } from '../i18n';
import { splitRows } from '../utils/common';

export interface ShapeProps {
  icon: React.ReactNode;
  title: string;
  pointer: DrawPointerType;
}

export const SHAPES: ShapeProps[] = [
  {
    icon: RectangleIcon,
    title: 'toolbar.shape.rectangle',
    pointer: BasicShapes.rectangle,
  },
  {
    icon: EllipseIcon,
    title: 'toolbar.shape.ellipse',
    pointer: BasicShapes.ellipse,
  },
  {
    icon: TriangleIcon,
    title: 'toolbar.shape.triangle',
    pointer: BasicShapes.triangle,
  },
  {
    icon: TerminalIcon,
    title: 'toolbar.shape.terminal',
    pointer: FlowchartSymbols.terminal,
  },
  {
    icon: DiamondIcon,
    title: 'toolbar.shape.diamond',
    pointer: BasicShapes.diamond,
  },
  {
    icon: ParallelogramIcon,
    title: 'toolbar.shape.parallelogram',
    pointer: BasicShapes.parallelogram,
  },
  {
    icon: RoundRectangleIcon,
    title: 'toolbar.shape.roundRectangle',
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
  const { t } = useI18n();
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
                    selected={PlaitBoard.isPointer(board, shape.pointer)}
                    icon={shape.icon}
                    title={t((shape.title || 'toolbar.shape') as keyof Translations)}
                    aria-label={t((shape.title || 'toolbar.shape') as keyof Translations)}
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
