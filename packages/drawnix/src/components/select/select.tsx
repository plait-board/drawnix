import * as React from 'react';
import classNames from 'classnames';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import { ChevronDownIcon, ThickCheckIcon } from '../icons';
import './select.scss';

type SelectValueType = string;

interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: SelectValueType | undefined;
  setValue: (value: SelectValueType) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  selectedIndex: number | null;
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>;
  labelsRef: React.MutableRefObject<Array<string | null>>;
  valuesRef: React.MutableRefObject<Array<SelectValueType | null>>;
  getReferenceProps: ReturnType<typeof useInteractions>['getReferenceProps'];
  getFloatingProps: ReturnType<typeof useInteractions>['getFloatingProps'];
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  refs: ReturnType<typeof useFloating>['refs'];
  floatingStyles: React.CSSProperties;
  floatingContext: ReturnType<typeof useFloating>['context'];
  size: '1' | '2' | '3';
  hideSelectedIndicator: boolean;
  disableItemHoverHighlight: boolean;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be wrapped in <Select.Root />');
  }
  return context;
};

interface SelectRootProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: '1' | '2' | '3';
  disabled?: boolean;
  placement?: Placement;
  sideOffset?: number;
  hideSelectedIndicator?: boolean;
  disableItemHoverHighlight?: boolean;
  disableInitialHighlight?: boolean;
  disableTypeahead?: boolean;
}

const SelectRoot: React.FC<SelectRootProps> = ({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange: setControlledOpen,
  size = '2',
  disabled = false,
  placement = 'bottom-start',
  sideOffset = 4,
  hideSelectedIndicator = false,
  disableItemHoverHighlight = false,
  disableInitialHighlight = false,
  disableTypeahead = false,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const setValue = React.useCallback(
    (nextValue: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [controlledValue, onValueChange]
  );

  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  const valuesRef = React.useRef<Array<SelectValueType | null>>([]);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const selectedIndex = React.useMemo(() => {
    if (value == null) return null;
    const index = valuesRef.current.findIndex((v) => v === value);
    return index >= 0 ? index : null;
  }, [value]);

  const navigationSelectedIndex = disableInitialHighlight ? null : selectedIndex;

  React.useEffect(() => {
    if (!open) return;
    if (disableInitialHighlight) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(selectedIndex ?? 0);
  }, [open, selectedIndex, disableInitialHighlight]);

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(sideOffset),
      flip({ padding: 5 }),
      shift({ padding: 5 }),
    ],
  });

  const click = useClick(context, { enabled: !disabled && controlledOpen === undefined });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'listbox' });

  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex: navigationSelectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
    focusItemOnHover: !disableItemHoverHighlight,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex: navigationSelectedIndex,
    onMatch: setActiveIndex,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
    disableTypeahead ? ({} as any) : typeahead,
  ]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      value,
      setValue,
      activeIndex,
      setActiveIndex,
      selectedIndex,
      elementsRef,
      labelsRef,
      valuesRef,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      refs,
      floatingStyles,
      floatingContext: context,
      size,
      hideSelectedIndicator,
      disableItemHoverHighlight,
    }),
    [
      open,
      setOpen,
      value,
      setValue,
      activeIndex,
      selectedIndex,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      refs,
      floatingStyles,
      context,
      size,
      hideSelectedIndicator,
      disableItemHoverHighlight,
    ]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  );
};
SelectRoot.displayName = 'Select.Root';

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'classic' | 'surface' | 'soft' | 'ghost';
  color?: string;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  placeholder?: string;
  asChild?: boolean;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      children,
      className,
      variant = 'surface',
      color,
      radius,
      placeholder,
      asChild,
      ...props
    },
    forwardedRef
  ) => {
    const context = useSelectContext();
    const mergedRef = useMergeRefs([context.refs.setReference, forwardedRef]);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref: mergedRef,
        ...context.getReferenceProps(props),
        'data-state': context.open ? 'open' : 'closed',
      } as any);
    }

    // Value rendering logic
    let content = children;
    if (!content && context.value) {
       // Find label for value
       const index = context.valuesRef.current.indexOf(context.value);
       if (index !== -1) {
         content = context.labelsRef.current[index];
       } else {
         content = context.value;
       }
    }
    
    const shouldShowPlaceholder = !content && placeholder;
    const displayContent = shouldShowPlaceholder ? placeholder : content;

    return (
      <button
        type="button"
        ref={mergedRef}
        className={classNames(
          'dx-reset',
          'dx-SelectTrigger',
          `dx-r-size-${context.size}`,
          `dx-variant-${variant}`,
          className
        )}
        data-state={context.open ? 'open' : 'closed'}
        data-placeholder={shouldShowPlaceholder ? '' : undefined}
        {...context.getReferenceProps(props)}
      >
        <span className="dx-SelectTriggerInner">{displayContent}</span>
        <span className="dx-SelectIcon">
          {ChevronDownIcon}
        </span>
      </button>
    );
  }
);
SelectTrigger.displayName = 'Select.Trigger';

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'soft';
  color?: string;
  highContrast?: boolean;
  container?: HTMLElement | null;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (
    {
      children,
      className,
      variant = 'solid',
      color,
      highContrast,
      container,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const context = useSelectContext();
    const mergedRef = useMergeRefs([context.refs.setFloating, forwardedRef]);

    if (!context.open) return null;

    return (
      <FloatingPortal root={container}>
        <FloatingFocusManager context={context.floatingContext} initialFocus={-1}>
          <div
            ref={mergedRef}
            className={classNames(
              'dx-SelectContent',
              `dx-r-size-${context.size}`,
              `dx-variant-${variant}`,
              className
            )}
            data-hide-selected-indicator={context.hideSelectedIndicator ? '' : undefined}
            style={{ ...context.floatingStyles, ...style }}
            {...context.getFloatingProps(props)}
          >
            <FloatingList elementsRef={context.elementsRef} labelsRef={context.labelsRef}>
              <div className="dx-SelectViewport">
                 {children}
              </div>
            </FloatingList>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    );
  }
);
SelectContent.displayName = 'Select.Content';

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  textValue?: string;
}

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ children, className, value, textValue, disabled, ...props }, forwardedRef) => {
    const context = useSelectContext();
    const { ref: itemRef, index } = useListItem({
      label: textValue ?? (typeof children === 'string' ? children : value),
    });
    const mergedRef = useMergeRefs([itemRef, forwardedRef]);

    const isActive = context.activeIndex === index;
    const isSelected = context.value === value;

    React.useEffect(() => {
        if (index !== null) {
            context.valuesRef.current[index] = value;
            // Best effort to get label
            context.labelsRef.current[index] = textValue ?? (typeof children === 'string' ? children : value);
        }
    }, [index, value, textValue, children, context.valuesRef, context.labelsRef]);

    const handleSelect = () => {
      context.setValue(value);
      context.setOpen(false);
    };

    const mergedItemProps = context.getItemProps({
      ...props,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        props.onClick?.(e as React.MouseEvent<HTMLButtonElement>);
        handleSelect();
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        props.onKeyDown?.(e as React.KeyboardEvent<HTMLButtonElement>);
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSelect();
        }
      },
    });

    const {
      onPointerMove,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      ...restMergedItemProps
    } = mergedItemProps as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button
        ref={mergedRef}
        type="button"
        role="option"
        aria-selected={isSelected}
        data-highlighted={isActive ? '' : undefined}
        data-state={isSelected ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        tabIndex={isActive ? 0 : -1}
        className={classNames('dx-SelectItem', className)}
        disabled={disabled}
        {...restMergedItemProps}
        {...(context.disableItemHoverHighlight
          ? {}
          : { onPointerMove, onMouseMove, onMouseEnter, onMouseLeave })}
      >
        {!context.hideSelectedIndicator && (
          <span className="dx-SelectItemIndicator">
            {isSelected && ThickCheckIcon}
          </span>
        )}
        <span className="dx-SelectItemText">{children}</span>
      </button>
    );
  }
);
SelectItem.displayName = 'Select.Item';

type SelectGroupProps = React.HTMLAttributes<HTMLDivElement>
const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames('dx-SelectGroup', className)} {...props} />
  )
);
SelectGroup.displayName = 'Select.Group';

type SelectLabelProps = React.HTMLAttributes<HTMLDivElement>
const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames('dx-SelectLabel', className)} {...props} />
  )
);
SelectLabel.displayName = 'Select.Label';

type SelectSeparatorProps = React.HTMLAttributes<HTMLDivElement>
const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames('dx-SelectSeparator', className)} {...props} />
  )
);
SelectSeparator.displayName = 'Select.Separator';

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
};
