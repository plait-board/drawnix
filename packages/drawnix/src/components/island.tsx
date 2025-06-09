// Credits to excalidraw
import classNames from 'classnames';
import './island.scss';

import React from 'react';

type IslandProps = {
  children: React.ReactNode;
  padding?: number;
  className?: string | boolean;
  style?: object;
} & React.HTMLAttributes<HTMLDivElement>;

export const Island = React.forwardRef<HTMLDivElement, IslandProps>(
  ({ children, padding, className, style, ...restProps }, ref) => (
    <div
      className={classNames('island', className)}
      style={{ '--padding': padding, ...style }}
      ref={ref}
      {...restProps}
    >
      {children}
    </div>
  )
);
