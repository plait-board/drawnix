import React, { useState } from 'react';
import classNames from 'classnames';
import { ATTACHED_ELEMENT_CLASS_NAME } from '@plait/core';
import DropdownMenu from '../dropdown-menu/DropdownMenu';
import { MenuIcon } from '../icons';
import { composeEventHandlers } from '../../utils';
import { OpenFile, SaveAsImage, SaveToFile, Socials } from './default-items';

type MainMenuProps = {
  children?: React.ReactNode;
  /**
   * Called when any menu item is selected (clicked on).
   */
  onSelect?: (event: Event) => void;
};

export const MainMenu: React.FC<MainMenuProps> = ({ onSelect, children }) => {
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  return (
    <div className={classNames('main-menu', ATTACHED_ELEMENT_CLASS_NAME)}>
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
          <OpenFile></OpenFile>
          <SaveToFile></SaveToFile>
          <SaveAsImage></SaveAsImage>
          <DropdownMenu.Separator />
          <Socials />
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};
