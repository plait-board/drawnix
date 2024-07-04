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
} from './icons';
import { useBoard } from '@plait/react-board';
import { BoardTransforms, PlaitBoard, PlaitPointerType } from '@plait/core';
import { MindPointerType } from '@plait/mind';
import { DrawnixPointerType } from '../drawnix';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { ArrowLineShape, BasicShapes, DrawPointerType } from '@plait/draw';
import * as Popover from '@radix-ui/react-popover';
import { useSetState } from 'ahooks';
import { ShapePopupContent } from './shape-popup';
import { ArrowPopupContent } from './arrow-popup';
import { useState } from 'react';

export enum PopupKey {
  'shape' = 'shape',
  'arrow' = 'arrow',
}

type AppToolButtonProps = {
  title?: string;
  name?: string;
  icon: React.ReactNode;
  pointer?: DrawnixPointerType;
  popupKey?: PopupKey;
};

const isBasicPointer = (pointer: string) => {
  return (
    pointer === PlaitPointerType.hand || pointer === PlaitPointerType.selection
  );
};

export const BUTTONS: AppToolButtonProps[] = [
  {
    icon: HandIcon,
    pointer: PlaitPointerType.hand,
    title: 'Hand',
  },
  {
    icon: SelectionIcon,
    pointer: PlaitPointerType.selection,
    title: 'Selection',
  },
  {
    icon: MindIcon,
    pointer: MindPointerType.mind,
    title: 'Mind',
  },
  {
    icon: TextIcon,
    pointer: BasicShapes.text,
    title: 'Text',
  },
  {
    icon: StraightArrowLineIcon,
    title: 'Arrow Line',
    popupKey: PopupKey.arrow,
    pointer: ArrowLineShape.straight,
  },
  {
    icon: ShapeIcon,
    title: 'Shape',
    popupKey: PopupKey.shape,
    pointer: BasicShapes.rectangle,
  },
];

export type DrawToolbarProps = {
  setPointer: (pointer: DrawnixPointerType) => void;
};

export const DrawToolbar: React.FC<DrawToolbarProps> = ({ setPointer }) => {
  const board = useBoard();

  const [arrowOpen, setArrowOpen] = useState(false);

  const [shapeOpen, setShapeOpen] = useState(false);

  const onChange = (pointer: DrawnixPointerType) => {
    BoardTransforms.updatePointerType(board, pointer);
    setPointer(pointer);
  };

  const onPointerDown = (pointer: DrawnixPointerType) => {
    setCreationMode(board, BoardCreationMode.dnd);
    BoardTransforms.updatePointerType(board, pointer);
    setPointer(pointer);
  };

  const onPointerUp = () => {
    setCreationMode(board, BoardCreationMode.drawing);
  };

  const isChecked = (button: AppToolButtonProps) => {
    return (
      PlaitBoard.isPointer(board, button.pointer) && !arrowOpen && !shapeOpen
    );
  };

  return (
    <Island padding={1} className={classNames('draw-toolbar')}>
      <Stack.Row gap={1}>
        {BUTTONS.map((button, index) => {
          if (button.popupKey === PopupKey.shape) {
            return (
              <Popover.Root
                key={index}
                open={shapeOpen}
                onOpenChange={(open) => {
                  setShapeOpen(open);
                }}
              >
                <Popover.Trigger asChild>
                  <ToolButton
                    className={classNames('Shape', { fillable: false })}
                    type="icon"
                    visible={true}
                    selected={shapeOpen || isChecked(button)}
                    icon={button.icon}
                    title={`Shape`}
                    aria-label={`Shape`}
                    onPointerDown={() => {
                      BoardTransforms.updatePointerType(
                        board,
                        BasicShapes.rectangle
                      );
                      setPointer(BasicShapes.rectangle);
                      setCreationMode(board, BoardCreationMode.drawing);
                    }}
                  />
                </Popover.Trigger>
                <ShapePopupContent
                  onPointerUp={(pointer: DrawPointerType) => {
                    setShapeOpen(false);
                    setPointer(pointer);
                  }}
                ></ShapePopupContent>
              </Popover.Root>
            );
          }

          if (button.popupKey === PopupKey.arrow) {
            return (
              <Popover.Root
                key={index}
                open={arrowOpen}
                onOpenChange={(open) => {
                  setArrowOpen(open);
                }}
              >
                <Popover.Trigger asChild>
                  <ToolButton
                    className={classNames('Shape', { fillable: false })}
                    type="icon"
                    visible={true}
                    selected={arrowOpen || isChecked(button)}
                    icon={button.icon}
                    title={`Shape`}
                    aria-label={`Shape`}
                    onPointerDown={() => {
                      BoardTransforms.updatePointerType(
                        board,
                        ArrowLineShape.straight
                      );
                      setPointer(ArrowLineShape.straight);
                      setCreationMode(board, BoardCreationMode.drawing);
                    }}
                  />
                </Popover.Trigger>
                {
                  <ArrowPopupContent
                    onPointerUp={(pointer: DrawPointerType) => {
                      setArrowOpen(false);
                      setPointer(pointer);
                    }}
                  ></ArrowPopupContent>
                }
              </Popover.Root>
            );
          }

          return (
            <ToolButton
              key={index}
              className={classNames('Shape', { fillable: false })}
              type="radio"
              icon={button.icon}
              checked={isChecked(button)}
              title={`${button.title}`}
              aria-label={`${button.title}`}
              onChange={() => {
                if (button.pointer && isBasicPointer(button.pointer)) {
                  onChange(button.pointer);
                }
              }}
              onPointerDown={() => {
                if (button.pointer && !isBasicPointer(button.pointer)) {
                  onPointerDown(button.pointer);
                }
              }}
              onPointerUp={() => {
                if (button.pointer && !isBasicPointer(button.pointer)) {
                  onPointerUp();
                }
              }}
            />
          );
        })}
      </Stack.Row>
    </Island>
  );
};
