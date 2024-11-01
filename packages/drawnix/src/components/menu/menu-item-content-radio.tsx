import { RadioGroup } from '../radio-group';

type Props<T> = {
  value: T;
  shortcut?: string;
  choices: {
    value: T;
    label: React.ReactNode;
    ariaLabel?: string;
  }[];
  onChange: (value: T) => void;
  children: React.ReactNode;
  name: string;
};

const MenuItemContentRadio = <T,>({
  value,
  shortcut,
  onChange,
  choices,
  children,
  name,
}: Props<T>) => {
  return (
    <>
      <div className="menu-item-base menu-item-bare">
        <label className="menu-item__text" htmlFor={name}>
          {children}
        </label>
        <RadioGroup
          name={name}
          value={value}
          onChange={onChange}
          choices={choices}
        />
      </div>
      {shortcut && (
        <div className="menu-item__shortcut menu-item__shortcut--orphaned">
          {shortcut}
        </div>
      )}
    </>
  );
};

MenuItemContentRadio.displayName = 'MenuItemContentRadio';

export default MenuItemContentRadio;
