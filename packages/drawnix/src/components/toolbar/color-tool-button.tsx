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

export type ActiveFillToolButtonProps = {
  currentColor: string | undefined;
  container: HTMLElement | undefined | null;
  transparentIcon: ReactNode;
  title: string;
  children?: React.ReactNode;
  onSelect: (selectedColor: string) => void;
};

export const ActiveColorToolButton: React.FC<ActiveFillToolButtonProps> = ({
  currentColor,
  container,
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
      <div ref={refs.setReference}>
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
          {...getReferenceProps()}
        >
          {currentColor && currentColor !== 'transparent' && children}
        </ToolButton>
      </div>

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
