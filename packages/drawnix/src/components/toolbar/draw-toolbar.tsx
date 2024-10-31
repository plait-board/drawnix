import classNames from 'classnames';
import { Island } from '../island';
import Stack from '../stack';
import { ToolButton } from '../tool-button';
import {
  HandIcon,
  MindIcon,
  SelectionIcon,
  ShapeIcon,
  TextIcon,
  StraightArrowLineIcon,
} from '../icons';
import { useBoard } from '@plait/react-board';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  BoardTransforms,
  PlaitBoard,
  PlaitPointerType,
} from '@plait/core';
import { MindPointerType } from '@plait/mind';
import { DrawnixPointerType } from '../../drawnix';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { ArrowLineShape, BasicShapes, DrawPointerType } from '@plait/draw';
import { ShapePanel } from './shape-panel';
import { ArrowPanel } from './arrow-panel';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';

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

// TODO provider by plait/draw
export const isArrowLinePointer = (board: PlaitBoard) => {
  return Object.keys(ArrowLineShape).includes(board.pointer);
};

export const isShapePointer = (board: PlaitBoard) => {
  return Object.keys(BasicShapes).includes(board.pointer);
};

export const DrawToolbar: React.FC<DrawToolbarProps> = ({ setPointer }) => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);

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
    <Island
      padding={1}
      className={classNames('draw-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <Stack.Row gap={1}>
        {BUTTONS.map((button, index) => {
          if (button.popupKey === PopupKey.shape) {
            return (
              <Popover
                key={index}
                open={shapeOpen}
                sideOffset={12}
                onOpenChange={(open) => {
                  setShapeOpen(open);
                }}
              >
                <PopoverTrigger asChild>
                  <ToolButton
                    type="icon"
                    visible={true}
                    selected={
                      shapeOpen ||
                      (isShapePointer(board) &&
                        !PlaitBoard.isPointer(board, BasicShapes.text))
                    }
                    icon={button.icon}
                    title={`Shape`}
                    aria-label={`Shape`}
                    onPointerDown={() => {
                      setShapeOpen(!shapeOpen);
                      BoardTransforms.updatePointerType(
                        board,
                        BasicShapes.rectangle
                      );
                      setPointer(BasicShapes.rectangle);
                      setCreationMode(board, BoardCreationMode.drawing);
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent container={container}>
                  <ShapePanel
                    onPointerUp={(pointer: DrawPointerType) => {
                      setShapeOpen(false);
                      setPointer(pointer);
                    }}
                  ></ShapePanel>
                </PopoverContent>
              </Popover>
            );
          }
          if (button.popupKey === PopupKey.arrow) {
            return (
              <Popover
                key={index}
                open={arrowOpen}
                sideOffset={12}
                onOpenChange={(open) => {
                  setArrowOpen(open);
                }}
              >
                <PopoverTrigger asChild>
                  <ToolButton
                    type="icon"
                    visible={true}
                    selected={arrowOpen || isArrowLinePointer(board)}
                    icon={button.icon}
                    title={`Arrow`}
                    aria-label={`Arrow`}
                    onPointerDown={() => {
                      setArrowOpen(!shapeOpen);
                      BoardTransforms.updatePointerType(
                        board,
                        ArrowLineShape.straight
                      );
                      setPointer(ArrowLineShape.straight);
                      setCreationMode(board, BoardCreationMode.drawing);
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent container={container}>
                  <ArrowPanel
                    onPointerUp={(pointer: DrawPointerType) => {
                      setArrowOpen(false);
                      setPointer(pointer);
                    }}
                  ></ArrowPanel>
                </PopoverContent>
              </Popover>
            );
          }
          return (
            <ToolButton
              key={index}
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
