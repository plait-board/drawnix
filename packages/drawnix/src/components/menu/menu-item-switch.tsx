import React from 'react';

export type MenuItemSwitchProps = {
  checked: boolean;
};

export const MenuItemSwitch = ({ checked }: MenuItemSwitchProps) => {
  return (
    <span
      className={`menu-item-switch ${checked ? 'menu-item-switch--checked' : ''}`.trim()}
      aria-hidden="true"
    >
      <span className="menu-item-switch__thumb" />
    </span>
  );
};

MenuItemSwitch.displayName = 'MenuItemSwitch';
