import React from 'react';
import { MenuItemSwitch } from './menu-item-switch';

export type MenuItemContentSwitchProps = {
  checked: boolean;
  children: React.ReactNode;
};

const MenuItemContentSwitch = ({ checked, children }: MenuItemContentSwitchProps) => {
  return (
    <>
      <div className="menu-item__left" aria-hidden="true">
        <MenuItemSwitch checked={checked} />
      </div>
      <div className="menu-item__right">
        <div className="menu-item__label">{children}</div>
      </div>
    </>
  );
};

MenuItemContentSwitch.displayName = 'MenuItemContentSwitch';
(MenuItemContentSwitch as any).__DRAWNIX_MENU_ITEM_CONTENT = true;

export default MenuItemContentSwitch;
