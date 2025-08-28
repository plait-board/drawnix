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
  EraseIcon,
  StraightArrowLineIcon,
  FeltTipPenIcon,
  ImageIcon,
  ExtraToolsIcon,
} from '../icons';
import { useBoard } from '@plait-board/react-board';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  BoardTransforms,
  PlaitBoard,
  PlaitPointerType,
} from '@plait/core';
import { MindPointerType } from '@plait/mind';
import { BoardCreationMode, setCreationMode } from '@plait/common';
import {
  ArrowLineShape,
  BasicShapes,
  DrawPointerType,
  FlowchartSymbols,
} from '@plait/draw';
import { FreehandPanel , FREEHANDS } from './freehand-panel/freehand-panel';
import { ShapePicker } from '../shape-picker';
import { ArrowPicker } from '../arrow-picker';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';
import { FreehandShape } from '../../plugins/freehand/type';
import {
  DrawnixPointerType,
  useDrawnix,
  useSetPointer,
} from '../../hooks/use-drawnix';
import { ExtraToolsButton } from './extra-tools/extra-tools-button';
import { addImage } from '../../utils/image';
import { useI18n } from '../../i18n';

export enum PopupKey {
  'shape' = 'shape',
  'arrow' = 'arrow',
  'freehand' = 'freehand',
}

type AppToolButtonProps = {
  titleKey?: keyof typeof import('../../i18n').Translations;
  name?: string;
  icon: React.ReactNode;
  pointer?: DrawnixPointerType;
  key?: PopupKey | 'image' | 'extra-tools';
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
    titleKey: 'toolbar.hand',
  },
  {
    icon: SelectionIcon,
    pointer: PlaitPointerType.selection,
    titleKey: 'toolbar.selection',
  },
  {
    icon: MindIcon,
    pointer: MindPointerType.mind,
    titleKey: 'toolbar.mind',
  },
  {
    icon: TextIcon,
    pointer: BasicShapes.text,
    titleKey: 'toolbar.text',
  },
  {
    icon: FeltTipPenIcon,
    pointer: FreehandShape.feltTipPen,
    titleKey: 'toolbar.pen',
    key: PopupKey.freehand,
  },
  {
    icon: StraightArrowLineIcon,
    titleKey: 'toolbar.arrow',
    key: PopupKey.arrow,
    pointer: ArrowLineShape.straight,
  },
  {
    icon: ShapeIcon,
    titleKey: 'toolbar.shape',
    key: PopupKey.shape,
    pointer: BasicShapes.rectangle,
  },
  {
    icon: ImageIcon,
    titleKey: 'toolbar.image',
    key: 'image',
  },
  {
    icon: ExtraToolsIcon,
    titleKey: 'toolbar.extraTools',
    key: 'extra-tools',
  },
];

// TODO provider by plait/draw
export const isArrowLinePointer = (board: PlaitBoard) => {
  return Object.keys(ArrowLineShape).includes(board.pointer);
};

export const isShapePointer = (board: PlaitBoard) => {
  return (
    Object.keys(BasicShapes).includes(board.pointer) ||
    Object.keys(FlowchartSymbols).includes(board.pointer)
  );
};

export const CreationToolbar = () => {
  const board = useBoard();
  const { appState } = useDrawnix();
  const { t } = useI18n();
  const setPointer = useSetPointer();
  const container = PlaitBoard.getBoardContainer(board);

  const [freehandOpen, setFreehandOpen] = useState(false);
  const [arrowOpen, setArrowOpen] = useState(false);
  const [shapeOpen, setShapeOpen] = useState(false);
  const [lastFreehandButton, setLastFreehandButton] =
    useState<AppToolButtonProps>(
      BUTTONS.find((button) => button.key === PopupKey.freehand)!
    );

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
      PlaitBoard.isPointer(board, button.pointer) && !arrowOpen && !shapeOpen && !freehandOpen
    );
  };

  const checkCurrentPointerIsFreehand = (board: PlaitBoard) => {
    return PlaitBoard.isInPointer(board, [
      FreehandShape.feltTipPen, 
      FreehandShape.eraser,
    ]);
  };


  return (
    <Island
      padding={1}
      className={classNames('draw-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <Stack.Row gap={1}>
        {BUTTONS.map((button, index) => {
          if (appState.isMobile && button.pointer === PlaitPointerType.hand) {
            return <></>;
          }
          if (button.key === PopupKey.freehand) {
            return (
              <Popover
                key={index}
                open={freehandOpen || checkCurrentPointerIsFreehand(board)}
                sideOffset={12}
                onOpenChange={(open) => {
                  setFreehandOpen(open);
                }}
              >
                <PopoverTrigger asChild>
                  <ToolButton
                    type="icon"
                    visible={true}
                    selected={
                      freehandOpen ||
                      checkCurrentPointerIsFreehand(board)
                    }
                    icon={lastFreehandButton.icon}
                    title={lastFreehandButton.titleKey ? t(lastFreehandButton.titleKey) : 'Freehand'}
                    aria-label={lastFreehandButton.titleKey ? t(lastFreehandButton.titleKey) : 'Freehand'}
                    onPointerDown={() => {
                      setFreehandOpen(!freehandOpen);
                      onPointerDown(lastFreehandButton.pointer!);
                    }}
                    onPointerUp={() => {
                      onPointerUp();
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent container={container}>
                  <FreehandPanel
                    onPointerUp={(pointer: DrawnixPointerType) => {
                      setPointer(pointer);
                      setLastFreehandButton(
                        FREEHANDS.find((button) => button.pointer === pointer)!
                      );
                    }}
                  ></FreehandPanel>
                </PopoverContent>
              </Popover>
            );
          }
          if (button.key === PopupKey.shape) {
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
                    title={button.titleKey ? t(button.titleKey) : 'Shape'}
                    aria-label={button.titleKey ? t(button.titleKey) : 'Shape'}
                    onPointerDown={() => {
                      setShapeOpen(!shapeOpen);
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent container={container}>
                  <ShapePicker
                    onPointerUp={(pointer: DrawPointerType) => {
                      setShapeOpen(false);
                      setPointer(pointer);
                    }}
                  ></ShapePicker>
                </PopoverContent>
              </Popover>
            );
          }
          if (button.key === PopupKey.arrow) {
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
                    title={button.titleKey ? t(button.titleKey) : ''}
                    aria-label={button.titleKey ? t(button.titleKey) : ''}
                    onPointerDown={() => {
                      setArrowOpen(!arrowOpen);
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent container={container}>
                  <ArrowPicker
                    onPointerUp={(pointer: DrawPointerType) => {
                      setArrowOpen(false);
                      setPointer(pointer);
                    }}
                  ></ArrowPicker>
                </PopoverContent>
              </Popover>
            );
          }
          if (button.key === 'extra-tools') {
            return <ExtraToolsButton key={index}></ExtraToolsButton>;
          }
          return (
            <ToolButton
              key={index}
              type="radio"
              icon={button.icon}
              checked={isChecked(button)}
              title={button.titleKey ? t(button.titleKey) : ''}
              aria-label={button.titleKey ? t(button.titleKey) : ''}
              onPointerDown={() => {
                if (button.pointer && !isBasicPointer(button.pointer)) {
                  onPointerDown(button.pointer);
                }
              }}
              onPointerUp={() => {
                if (button.pointer && !isBasicPointer(button.pointer)) {
                  onPointerUp();
                } else if (button.pointer && isBasicPointer(button.pointer)) {
                  BoardTransforms.updatePointerType(board, button.pointer);
                  setPointer(button.pointer);
                }
                if (button.key === 'image') {
                  addImage(board);
                }
              }}
            />
          );
        })}
      </Stack.Row>
    </Island>
  );
};
