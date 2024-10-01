import React, { ReactNode, useState } from 'react';
import { ColorPicker } from '../color-picker';
import { ToolButton } from '../tool-button';
import classNames from 'classnames';
import {
  autoUpdate,
  flip,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';

export type ActiveColorToolButtonProps = {
  currentColor: string | undefined;
  transparentIcon: ReactNode;
  title: string;
  children?: React.ReactNode;
  onSelect: (selectedColor: string) => void;
};

export type ActiveFontColorToolButtonProps = {
  currentColor: string | undefined;
  fontColorIcon: ReactNode;
  title: string;
  onSelect: (selectedColor: string) => void;
};

export const ActiveColorToolButton: React.FC<ActiveColorToolButtonProps> = ({
  currentColor,
  transparentIcon,
  title,
  children,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: 'left',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip()],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      <ToolButton
        className={classNames(`property-button`)}
        visible={true}
        icon={
          currentColor && currentColor !== 'transparent'
            ? undefined
            : transparentIcon
        }
        type="button"
        title={title}
        aria-label={title}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {currentColor && currentColor !== 'transparent' && children}
      </ToolButton>
      {isOpen && (
        <ColorPicker
          ref={refs.setFloating}
          style={floatingStyles}
          onSelect={(selectedColor) => {
            onSelect(selectedColor);
          }}
          currentColor={currentColor}
        ></ColorPicker>
      )}
    </>
  );
};

export const ActiveFontColorToolButton: React.FC<
  ActiveFontColorToolButtonProps
> = ({ currentColor, fontColorIcon, title, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: 'left',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip()],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      <ToolButton
        className={classNames(`property-button`)}
        visible={true}
        icon={fontColorIcon}
        type="button"
        title={title}
        aria-label={title}
        ref={refs.setReference}
        {...getReferenceProps()}
      ></ToolButton>
      {isOpen && (
        <ColorPicker
          ref={refs.setFloating}
          style={floatingStyles}
          onSelect={(selectedColor) => {
            onSelect(selectedColor);
          }}
          currentColor={currentColor}
        ></ColorPicker>
      )}
    </>
  );
};
