import React, { ReactNode, useState } from 'react';
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
import { ATTACHED_ELEMENT_CLASS_NAME } from '@plait/core';
import { Island } from '../island';
import { ColorPicker } from '../color-picker';
import { isTransparent, isWhite, removeHexAlpha } from '../../utils/color';
import { StrokeIcon, StrokeWhiteIcon } from '../icons';

export type PopupStrokeButtonProps = {
  currentColor: string | undefined;
  title: string;
  children?: React.ReactNode;
  onColorSelect: (selectedColor: string) => void;
};

export const PopupStrokeButton: React.FC<PopupStrokeButtonProps> = ({
  currentColor,
  title,
  children,
  onColorSelect,
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

  const hexColor = currentColor && removeHexAlpha(currentColor);

  let icon = isTransparent(hexColor)
    ? StrokeIcon
    : isWhite(hexColor)
    ? StrokeWhiteIcon
    : undefined;

  return (
    <>
      <ToolButton
        className={classNames(`property-button`)}
        visible={true}
        icon={icon}
        type="button"
        title={title}
        aria-label={title}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {!icon && children}
      </ToolButton>
      {isOpen && (
        <Island
          ref={refs.setFloating}
          style={floatingStyles}
          padding={4}
          className={classNames(`${ATTACHED_ELEMENT_CLASS_NAME}`)}
        >
          <ColorPicker
            onSelect={(selectedColor) => {
              onColorSelect(selectedColor);
            }}
            currentColor={currentColor}
          ></ColorPicker>
        </Island>
      )}
    </>
  );
};
