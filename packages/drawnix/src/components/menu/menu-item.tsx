import React, { useState, useRef } from 'react';
import {
  getMenuItemClassName,
  useHandleMenuItemClick,
} from './common';
import MenuItemContent from './menu-item-content';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';

const MenuItem = ({
  icon,
  onSelect,
  children,
  shortcut,
  className,
  selected,
  submenu,
  ...rest
}: {
  icon?: React.ReactNode;
  onSelect: (event: Event) => void;
  children: React.ReactNode;
  shortcut?: string;
  selected?: boolean;
  className?: string;
  submenu?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<number>();
  const handleClick = useHandleMenuItemClick(rest.onClick, onSelect);
  
  const menuItemContent = (
    <MenuItemContent icon={icon} shortcut={shortcut}>
      {children}
    </MenuItemContent>
  );

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  if (submenu) {
    return (
      <Popover 
        open={isOpen}
        onOpenChange={setIsOpen}
        placement="right-start"
      >
        <PopoverTrigger asChild>
          <button
            {...rest}
            type="button"
            className={getMenuItemClassName(className, selected || isOpen)}
            title={rest.title ?? rest['aria-label']}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {menuItemContent}
          </button>
        </PopoverTrigger>
        <PopoverContent onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {submenu}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <button
      {...rest}
      onClick={handleClick}
      type="button"
      className={getMenuItemClassName(className, selected)}
      title={rest.title ?? rest['aria-label']}
    >
      {menuItemContent}
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
