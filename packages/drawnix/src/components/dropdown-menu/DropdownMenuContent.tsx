import { Island } from '../island';
import React, { useEffect, useRef } from 'react';
import { DropdownMenuContentPropsContext } from './common';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { EVENT } from '../../constants';
import { useStable } from '../../hooks/use-stable';
import classNames from 'classnames';
import { KEYS } from '../../keys';

const MenuContent = ({
  children,
  onClickOutside,
  className = '',
  onSelect,
  style,
}: {
  children?: React.ReactNode;
  onClickOutside?: () => void;
  className?: string;
  /**
   * Called when any menu item is selected (clicked on).
   */
  onSelect?: (event: Event) => void;
  style?: React.CSSProperties;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const callbacksRef = useStable({ onClickOutside });

  useOutsideClick(menuRef, () => {
    callbacksRef.onClickOutside?.();
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE) {
        event.stopImmediatePropagation();
        callbacksRef.onClickOutside?.();
      }
    };

    const option = {
      // so that we can stop propagation of the event before it reaches
      // event handlers that were bound before this one
      capture: true,
    };

    document.addEventListener(EVENT.KEYDOWN, onKeyDown, option);
    return () => {
      document.removeEventListener(EVENT.KEYDOWN, onKeyDown, option);
    };
  }, [callbacksRef]);

  const newClassName = classNames(`dropdown-menu ${className}`).trim();

  return (
    <DropdownMenuContentPropsContext.Provider value={{ onSelect }}>
      <div
        ref={menuRef}
        className={newClassName}
        style={style}
        data-testid="dropdown-menu"
      >
        {/* the zIndex ensures this menu has higher stacking order,
    see https://github.com/excalidraw/excalidraw/pull/1445 */}
        {
          <Island
            className="dropdown-menu-container"
            padding={2}
            style={{ zIndex: 2 }}
          >
            {children}
          </Island>
        }
      </div>
    </DropdownMenuContentPropsContext.Provider>
  );
};
MenuContent.displayName = 'DropdownMenuContent';

export default MenuContent;
