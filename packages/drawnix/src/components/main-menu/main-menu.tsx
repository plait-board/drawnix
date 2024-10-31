import React, { useState } from 'react';
import classNames from 'classnames';
import { ATTACHED_ELEMENT_CLASS_NAME } from '@plait/core';
import DropdownMenu from '../dropdown-menu/DropdownMenu';
import { MenuIcon } from '../icons';
import { composeEventHandlers } from '../../utils/common';
import { OpenFile, SaveAsImage, SaveToFile, Socials } from './default-items';
import { Island } from '../island';

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
    <Island className={classNames('main-menu', ATTACHED_ELEMENT_CLASS_NAME)}>
      <DropdownMenu open={mainMenuOpen}>
        <DropdownMenu.Trigger
          onToggle={() => {
            setMainMenuOpen(!mainMenuOpen);
          }}
          data-testid="main-menu-trigger"
          className={classNames("main-menu-trigger", { 'active': mainMenuOpen })}
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
    </Island>
  );
};
