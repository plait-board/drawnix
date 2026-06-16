import React from 'react';
import { ChevronRightIcon } from '../icons';

export const MenuItemSwitch = ({ checked }: { checked: boolean }) => {
  return (
    <span
      className={`menu-item-switch ${checked ? 'menu-item-switch--checked' : ''}`.trim()}
      aria-hidden="true"
    >
      <span className="menu-item-switch__thumb" />
    </span>
  );
};

const MenuItemContent = ({
  icon,
  shortcut,
  hasSubmenu,
  children,
}: {
  icon?: React.ReactNode;
  shortcut?: string;
  hasSubmenu?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <>
      {icon && <div className="menu-item__icon">{icon}</div>}
      <div className="menu-item__text">{children}</div>
      {(shortcut || hasSubmenu) && (
        <div className="menu-item__right">
          {shortcut && <div className="menu-item__shortcut">{shortcut}</div>}
          {hasSubmenu && <div className="menu-item__submenu-indicator">{ChevronRightIcon}</div>}
        </div>
      )}
    </>
  );
};
export default MenuItemContent;
