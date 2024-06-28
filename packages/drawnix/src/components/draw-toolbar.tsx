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
import { BasicShapes } from '@plait/draw';
import * as Popover from '@radix-ui/react-popover';
import { useSetState } from 'ahooks';
import { ShapePickerPopupContent } from './shape-picker';

type AppToolButtonProps = {
  title?: string;
  name?: string;
  icon: React.ReactNode;
  pointer?: DrawnixPointerType;
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
  // {
  //   name: 'shape',
  //   icon: ShapeIcon,
  //   title: 'Shape',
  // },
  {
    icon: StraightArrowLineIcon,
    title: 'Arrow Line',
  },
];

export type DrawToolbarProps = {
  setPointer: (pointer: DrawnixPointerType) => void;
};

export const DrawToolbar: React.FC<DrawToolbarProps> = ({ setPointer }) => {
  const board = useBoard();

  const [state, setState] = useSetState<{ isShapePicker: boolean }>({
    isShapePicker: false,
  });

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
    return PlaitBoard.isPointer(board, button.pointer) && !state.isShapePicker;
  };

  return (
    <Island padding={1} className={classNames('draw-toolbar')}>
      <Stack.Row gap={1}>
        {BUTTONS.map((button, index) => {
          const buttonComp = (
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
          return buttonComp;
        })}
        <Popover.Root
          onOpenChange={(open) => {
            setState({ isShapePicker: open });
          }}
        >
          <Popover.Trigger asChild>
            <ToolButton
              className={classNames('Shape', { fillable: false })}
              type="icon"
              visible={true}
              selected={state.isShapePicker}
              icon={ShapeIcon}
              title={`Shape`}
              aria-label={`Shape`}
            />
          </Popover.Trigger>
          <ShapePickerPopupContent></ShapePickerPopupContent>
        </Popover.Root>
      </Stack.Row>
    </Island>
  );
};
