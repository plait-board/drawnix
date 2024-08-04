import React, { useState } from 'react';
import classNames from 'classnames';
import { Island } from '../island';
import { useBoard } from '@plait/react-board';
import { PlaitBoard } from '@plait/core';
import DropdownMenu from '../dropdown-menu/DropdownMenu';
import { MenuIcon } from '../icons';
import { composeEventHandlers } from '../../utils';
import { SaveAsImage, Socials } from './DefaultItems';

type MainMenuProps = {
  children?: React.ReactNode;
  /**
   * Called when any menu item is selected (clicked on).
   */
  onSelect?: (event: Event) => void;
};

export const MainMenu: React.FC<MainMenuProps> = ({ onSelect, children }) => {
  const board = useBoard();
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const container = PlaitBoard.getBoardContainer(board);

  return (
    <div className={classNames('main-menu')}>
      <DropdownMenu open={mainMenuOpen}>
        <DropdownMenu.Trigger
          onToggle={() => {
            setMainMenuOpen(!mainMenuOpen);
          }}
          data-testid="main-menu-trigger"
          className="main-menu-trigger"
        >
          {MenuIcon}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          onClickOutside={() => {
            setMainMenuOpen(false);
          }}
          onSelect={composeEventHandlers(onSelect, () => {
            setMainMenuOpen(false);
          })}
        >
          <SaveAsImage></SaveAsImage>
          <DropdownMenu.Separator />
          <Socials />
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};
