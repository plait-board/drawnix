import React from 'react';

const MenuItemCustom = ({
  children,
  className = '',
  selected,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...rest}
      className={`menu-item-base menu-item-custom ${className} ${
        selected ? `menu-item--selected` : ``
      }`.trim()}
    >
      {children}
    </div>
  );
};

export default MenuItemCustom;
