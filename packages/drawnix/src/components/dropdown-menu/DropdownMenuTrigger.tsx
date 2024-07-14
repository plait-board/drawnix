import classNames from 'classnames';

const MenuTrigger = ({
  className = '',
  children,
  onToggle,
  title,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  onToggle: () => void;
  title?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'>) => {
  return (
    <button
      data-prevent-outside-click
      className={classNames(
        `dropdown-menu-button ${className}`,
        'zen-mode-transition'
      ).trim()}
      onClick={onToggle}
      type="button"
      data-testid="dropdown-menu-button"
      title={title}
      {...rest}
    >
      {children}
    </button>
  );
};

export default MenuTrigger;
MenuTrigger.displayName = 'DropdownMenuTrigger';
