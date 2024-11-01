import React from 'react';
import {
  getMenuItemClassName,
  useHandleMenuItemClick,
} from './common';
import MenuItemContent from './menu-item-content';

const MenuItem = ({
  icon,
  onSelect,
  children,
  shortcut,
  className,
  selected,
  ...rest
}: {
  icon?: React.ReactNode;
  onSelect: (event: Event) => void;
  children: React.ReactNode;
  shortcut?: string;
  selected?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>) => {
  const handleClick = useHandleMenuItemClick(rest.onClick, onSelect);

  return (
    <button
      {...rest}
      onClick={handleClick}
      type="button"
      className={getMenuItemClassName(className, selected)}
      title={rest.title ?? rest['aria-label']}
    >
      <MenuItemContent icon={icon} shortcut={shortcut}>
        {children}
      </MenuItemContent>
    </button>
  );
};
MenuItem.displayName = 'MenuItem';

export const DropDownMenuItemBadge = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        marginLeft: 'auto',
        padding: '2px 4px',
        background: 'var(--color-promo)',
        color: 'var(--color-surface-lowest)',
        borderRadius: 6,
        fontSize: 9,
        fontFamily: 'Cascadia, monospace',
      }}
    >
      {children}
    </div>
  );
};
DropDownMenuItemBadge.displayName = 'MenuItemBadge';

MenuItem.Badge = DropDownMenuItemBadge;

export default MenuItem;
