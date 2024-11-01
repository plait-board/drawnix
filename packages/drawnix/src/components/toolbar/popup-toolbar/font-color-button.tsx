import React, { ReactNode, useState } from 'react';
import { ColorPicker } from '../../color-picker';
import { ToolButton } from '../../tool-button';
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
import { Island } from '../../island';
import { ATTACHED_ELEMENT_CLASS_NAME } from '@plait/core';

export type PopupFontColorButtonProps = {
  currentColor: string | undefined;
  fontColorIcon: ReactNode;
  title: string;
  onSelect: (selectedColor: string) => void;
};

export const PopupFontColorButton: React.FC<PopupFontColorButtonProps> = ({
  currentColor,
  fontColorIcon,
  title,
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
        icon={fontColorIcon}
        type="button"
        title={title}
        aria-label={title}
        ref={refs.setReference}
        {...getReferenceProps()}
      ></ToolButton>
      {isOpen && (
        <Island
          ref={refs.setFloating}
          style={floatingStyles}
          padding={4}
          className={classNames(`${ATTACHED_ELEMENT_CLASS_NAME}`)}
        >
          <ColorPicker
            onSelect={(selectedColor) => {
              onSelect(selectedColor);
            }}
            currentColor={currentColor}
          ></ColorPicker>
        </Island>
      )}
    </>
  );
};
