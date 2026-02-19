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

import './select.scss';

type SelectValueType = string;

interface SelectOptions {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: SelectValueType;
  defaultValue?: SelectValueType;
  onValueChange?: (value: SelectValueType) => void;
  placement?: Placement;
  sideOffset?: number;
  modal?: boolean;
}

type SelectContextType = {
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
  modal?: boolean;
};

const SelectContext = React.createContext<SelectContextType | null>(null);

const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be wrapped in <Select />');
  }
  return context;
};

export function Select({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange: setControlledOpen,
  value: controlledValue,
  defaultValue,
  onValueChange,
  placement = 'bottom-start',
  sideOffset = 4,
  modal = false,
}: { children: React.ReactNode } & SelectOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    SelectValueType | undefined
  >(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const setValue = React.useCallback(
    (nextValue: SelectValueType) => {
      if (controlledValue == null) {
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

  React.useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex ?? 0);
  }, [open, selectedIndex]);

  const data = useFloating({
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

  const click = useClick(data.context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(data.context);
  const role = useRole(data.context, { role: 'listbox' });

  const listNavigation = useListNavigation(data.context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const typeahead = useTypeahead(data.context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: setActiveIndex,
  });

  const interactions = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
    typeahead,
  ]);

  const contextValue: SelectContextType = React.useMemo(
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
      getReferenceProps: interactions.getReferenceProps,
      getFloatingProps: interactions.getFloatingProps,
      getItemProps: interactions.getItemProps,
      refs: data.refs,
      floatingStyles: data.floatingStyles,
      floatingContext: data.context,
      modal,
    }),
    [
      open,
      setOpen,
      value,
      setValue,
      activeIndex,
      selectedIndex,
      interactions.getReferenceProps,
      interactions.getFloatingProps,
      interactions.getItemProps,
      data.refs,
      data.floatingStyles,
      data.context,
      modal,
    ]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const SelectTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & SelectTriggerProps
>(function SelectTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useSelectContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
        'aria-haspopup': 'listbox',
        'aria-expanded': context.open,
      })
    );
  }

  return (
    <button
      ref={ref as any}
      type="button"
      data-state={context.open ? 'open' : 'closed'}
      aria-haspopup="listbox"
      aria-expanded={context.open}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export type SelectValueProps = {
  placeholder?: React.ReactNode;
  children?:
    | React.ReactNode
    | ((data: { value: SelectValueType | undefined }) => React.ReactNode);
};

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder,
  children,
}) => {
  const context = useSelectContext();
  const selectedLabel =
    context.selectedIndex != null
      ? context.labelsRef.current[context.selectedIndex]
      : null;
  const content =
    typeof children === 'function'
      ? children({ value: context.value })
      : children;

  if (content != null) {
    return <>{content}</>;
  }

  if (context.value == null) {
    return <>{placeholder ?? null}</>;
  }

  return <>{selectedLabel ?? context.value}</>;
};

export type SelectContentProps = React.HTMLProps<HTMLDivElement> & {
  container?: HTMLElement | null;
};

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent({ container, style, ...props }, propRef) {
    const context = useSelectContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    if (!context.open) return null;

    const { className, ...rest } = props;

    return (
      <FloatingPortal root={container}>
        <FloatingFocusManager
          context={context.floatingContext}
          modal={context.modal}
          initialFocus={-1}
        >
          <div
            ref={ref}
            style={{ ...context.floatingStyles, ...style }}
            {...context.getFloatingProps({
              ...rest,
              className: classNames('select-content', className),
            })}
          >
            <FloatingList
              elementsRef={context.elementsRef}
              labelsRef={context.labelsRef}
            >
              <div className="select-viewport">{props.children}</div>
            </FloatingList>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    );
  }
);

export type SelectItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: SelectValueType;
  textValue?: string;
};

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  function SelectItem(
    {
      value,
      textValue,
      disabled,
      onPointerUp,
      onPointerMove,
      className,
      ...props
    },
    propRef
  ) {
    const context = useSelectContext();
    const { ref: itemRef, index } = useListItem({
      label: textValue ?? value,
    });
    const mergedRef = useMergeRefs([itemRef, propRef]);

    React.useEffect(() => {
      if (index == null) return;
      context.valuesRef.current[index] = value;
      context.labelsRef.current[index] = textValue ?? value;
    }, [context, index, value, textValue]);

    const selected = context.value === value;
    const active = context.activeIndex === index;

    return (
      <button
        {...props}
        ref={mergedRef}
        type="button"
        role="option"
        aria-selected={selected}
        data-selected={selected ? '' : undefined}
        data-active={active ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        tabIndex={active ? 0 : -1}
        className={classNames('select-item', className)}
        {...context.getItemProps({
          onPointerMove: (event) => {
            onPointerMove?.(
              event as unknown as React.PointerEvent<HTMLButtonElement>
            );
            if (!disabled) {
              context.setActiveIndex(index);
            }
          },
          onPointerUp: (event) => {
            onPointerUp?.(
              event as unknown as React.PointerEvent<HTMLButtonElement>
            );
            if (disabled) return;
            context.setValue(value);
            context.setOpen(false);
          },
        })}
      >
        <span className="select-item__indicator" aria-hidden="true">
          {selected && (
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.25 4.75L6.75 11.25L3.25 7.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="select-item__text">{props.children}</span>
      </button>
    );
  }
);
