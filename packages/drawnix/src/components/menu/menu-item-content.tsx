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
      {icon && <div className="menu-item__icon">{icon}</div>}
      <div className="menu-item__text">{children}</div>
      {shortcut && (
        <div className="menu-item__shortcut">{shortcut}</div>
      )}
    </>
  );
};
export default MenuItemContent;
