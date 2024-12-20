import React from 'react';

const MenuGroup = ({
  children,
  className = '',
  style,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}) => {
  return (
    <div className={`menu-group ${className}`} style={style}>
      {title && <p className="menu-group-title">{title}</p>}
      {children}
    </div>
  );
};

export default MenuGroup;
MenuGroup.displayName = 'MenuGroup';
