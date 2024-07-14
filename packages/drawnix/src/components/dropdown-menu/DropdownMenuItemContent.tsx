import React from 'react';

const MenuItemContent = ({
  icon,
  shortcut,
  children,
}: {
  icon?: React.ReactNode;
  shortcut?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="dropdown-menu-item__icon">{icon}</div>
      <div className="dropdown-menu-item__text">{children}</div>
      {shortcut && (
        <div className="dropdown-menu-item__shortcut">{shortcut}</div>
      )}
    </>
  );
};
export default MenuItemContent;
