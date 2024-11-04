import React, { useState } from 'react';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import { ATTACHED_ELEMENT_CLASS_NAME, PlaitBoard } from '@plait/core';
import { Island } from '../../island';
import { ColorPicker } from '../../color-picker';
import { isTransparent, removeHexAlpha } from '../../../utils/color';
import { BackgroundColorIcon } from '../../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';

export type PopupFillButtonProps = {
  board: PlaitBoard;
  currentColor: string | undefined;
  title: string;
  children?: React.ReactNode;
  onColorSelect: (selectedColor: string) => void;
};

export const PopupFillButton: React.FC<PopupFillButtonProps> = ({
  board,
  currentColor,
  title,
  children,
  onColorSelect,
}) => {
  const [isFillPropertyOpen, setIsFillPropertyOpen] = useState(false);
  const hexColor = currentColor && removeHexAlpha(currentColor);
  const container = PlaitBoard.getBoardContainer(board);

  let icon =
    !hexColor || isTransparent(hexColor) ? BackgroundColorIcon : undefined;

  return (
    <Popover
      sideOffset={12}
      open={isFillPropertyOpen}
      onOpenChange={(open) => {
        setIsFillPropertyOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <ToolButton
          className={classNames(`property-button`)}
          visible={true}
          icon={icon}
          type="button"
          title={title}
          aria-label={title}
          onPointerUp={() => {
            setIsFillPropertyOpen(!isFillPropertyOpen);
          }}
        >
          {!icon && children}
        </ToolButton>
      </PopoverTrigger>
      <PopoverContent container={container}>
        <Island
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
      </PopoverContent>
    </Popover>
  );
};
