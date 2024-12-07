import { useBoard } from '@plait/react-board';
import Stack from '../../stack';
import { ToolButton } from '../../tool-button';
import {
  DuplicateIcon,
  MenuIcon,
  RedoIcon,
  TrashIcon,
  UndoIcon,
} from '../../icons';
import classNames from 'classnames';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  deleteFragment,
  duplicateElements,
  getSelectedElements,
  PlaitBoard,
} from '@plait/core';
import { Island } from '../../island';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import { useState } from 'react';
import { OpenFile, SaveAsImage, SaveToFile, Socials } from './app-menu-items';
import Menu from '../../menu/menu';
import MenuSeparator from '../../menu/menu-separator';

export const AppToolbar = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  const selectedElements = getSelectedElements(board);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const isUndoDisabled = board.history.undos.length <= 0;
  const isRedoDisabled = board.history.redos.length <= 0;
  return (
    <Island
      padding={1}
      className={classNames('app-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <Stack.Row gap={1}>
        <Popover
          key={0}
          sideOffset={12}
          open={appMenuOpen}
          onOpenChange={(open) => {
            setAppMenuOpen(open);
          }}
          placement="bottom-start"
        >
          <PopoverTrigger asChild>
            <ToolButton
              type="icon"
              visible={true}
              selected={appMenuOpen}
              icon={MenuIcon}
              title={`App Menu`}
              aria-label={`App Menu`}
              onPointerDown={() => {
                setAppMenuOpen(!appMenuOpen);
              }}
            />
          </PopoverTrigger>
          <PopoverContent container={container}>
            <Menu
              onSelect={() => {
                setAppMenuOpen(false);
              }}
            >
              <OpenFile></OpenFile>
              <SaveToFile></SaveToFile>
              <SaveAsImage></SaveAsImage>
              <MenuSeparator />
              <Socials />
            </Menu>
          </PopoverContent>
        </Popover>
        <ToolButton
          key={1}
          type="icon"
          icon={UndoIcon}
          visible={true}
          title={`Undo`}
          aria-label={`Undo`}
          onPointerUp={() => {
            board.undo();
          }}
          disabled={isUndoDisabled}
        />
        <ToolButton
          key={2}
          type="icon"
          icon={RedoIcon}
          visible={true}
          title={`Redo`}
          aria-label={`Redo`}
          onPointerUp={() => {
            board.redo();
          }}
          disabled={isRedoDisabled}
        />
        {selectedElements.length > 0 && (
          <ToolButton
            className="duplicate"
            key={3}
            type="icon"
            icon={DuplicateIcon}
            visible={true}
            title={`Duplicate`}
            aria-label={`Duplicate`}
            onPointerUp={() => {
              duplicateElements(board);
            }}
          />
        )}
        {selectedElements.length > 0 && (
          <ToolButton
            className="trash"
            key={4}
            type="icon"
            icon={TrashIcon}
            visible={true}
            title={`Trash`}
            aria-label={`Trash`}
            onPointerUp={() => {
              deleteFragment(board);
            }}
          />
        )}
        
      </Stack.Row>
    </Island>
  );
};
