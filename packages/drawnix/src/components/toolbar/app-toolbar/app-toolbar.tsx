import { useBoard } from '@plait/react-board';
import Stack from '../../stack';
import { ToolButton } from '../../tool-button';
import { MenuIcon } from '../../icons';
import classNames from 'classnames';
import { ATTACHED_ELEMENT_CLASS_NAME, PlaitBoard } from '@plait/core';
import { Island } from '../../island';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import { useState } from 'react';
import { OpenFile, SaveAsImage, SaveToFile, Socials } from './app-menu-items';
import Menu from '../../menu/menu';
import MenuSeparator from '../../menu/menu-separator';

export const AppToolbar: React.FC<{}> = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  return (
    <Island
      padding={1}
      className={classNames('app-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <Stack.Row>
        <Popover
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
      </Stack.Row>
    </Island>
  );
};
