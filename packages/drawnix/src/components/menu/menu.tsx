import { Island } from '../island';
import React from 'react';
import { MenuContentPropsContext } from './common';
import classNames from 'classnames';
import './menu.scss';

const Menu = ({
  children,
  className = '',
  onSelect,
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  /**
   * Called when any menu item is selected (clicked on).
   */
  onSelect?: (event: Event) => void;
  style?: React.CSSProperties;
}) => {
  const newClassName = classNames(`menu ${className}`).trim();

  return (
    <MenuContentPropsContext.Provider value={{ onSelect }}>
      <div className={newClassName} style={style} data-testid="menu">
        {
          <Island className="menu-container" padding={2}>
            {children}
          </Island>
        }
      </div>
    </MenuContentPropsContext.Provider>
  );
};
Menu.displayName = 'Menu';

export default Menu;
