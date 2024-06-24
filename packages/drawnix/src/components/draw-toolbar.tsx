import classNames from 'classnames';
import { Island } from './Island';
import Stack from './Stack';
import { ToolButton } from './ToolButton';
import {
  HandIcon,
  MindIcon,
  SelectionIcon,
  ShapeIcon,
  TextIcon,
} from './icons';
import { useBoard } from '@plait/react-board';
import { BoardTransforms, PlaitBoard, PlaitPointerType } from '@plait/core';
import { MindPointerType } from '@plait/mind';
import { DrawnixPointerType } from '../drawnix';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import { BasicShapes } from '@plait/draw';

type AppToolButtonProps = {
  title?: string;
  name?: string;
  icon: React.ReactNode;
  pointer?: DrawnixPointerType;
};

export const BUTTONS: AppToolButtonProps[] = [
  {
    icon: HandIcon,
    pointer: PlaitPointerType.hand,
  },
  {
    icon: SelectionIcon,
    pointer: PlaitPointerType.selection,
  },
  {
    icon: MindIcon,
    pointer: MindPointerType.mind,
  },
  {
    icon: ShapeIcon,
  },
  {
    icon: TextIcon,
    pointer: BasicShapes.text,
  },
];

export type DrawToolbarProps = {
  setPointer: (pointer: DrawnixPointerType) => void;
};

export const DrawToolbar: React.FC<DrawToolbarProps> = ({ setPointer }) => {
  const board = useBoard();

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
  return (
    <div className="App-menu App-menu_top">
      <Island padding={1} className={classNames('App-toolbar')}>
        <Stack.Row gap={1}>
          {BUTTONS.map((button, index) => {
            return (
              <ToolButton
                key={index}
                className={classNames('Shape', { fillable: false })}
                type="radio"
                icon={button.icon}
                checked={PlaitBoard.isPointer(board, button.pointer)}
                title={`${button.title} — H`}
                aria-label={`${button.title} — H`}
                onChange={() => {
                  if (
                    button.pointer &&
                    (button.pointer === PlaitPointerType.hand ||
                      button.pointer === PlaitPointerType.selection)
                  ) {
                    onChange(button.pointer);
                  }
                }}
                onPointerDown={() => {
                  if (
                    button.pointer &&
                    button.pointer !== PlaitPointerType.hand &&
                    button.pointer !== PlaitPointerType.selection
                  ) {
                    onPointerDown(button.pointer);
                  }
                }}
                onPointerUp={() => {
                  if (
                    button.pointer &&
                    button.pointer !== PlaitPointerType.hand &&
                    button.pointer !== PlaitPointerType.selection
                  ) {
                    onPointerUp();
                  }
                }}
              />
            );
          })}
        </Stack.Row>
      </Island>
    </div>
  );
};
