import React, { useState } from 'react';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import { ATTACHED_ELEMENT_CLASS_NAME, PlaitBoard } from '@plait/core';
import { Island } from '../../island';
import { ColorPicker } from '../../color-picker';
import { isTransparent, isWhite, removeHexAlpha } from '../../../utils/color';
import { StrokeIcon, StrokeWhiteIcon } from '../../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';

export type PopupStrokeButtonProps = {
  board: PlaitBoard;
  currentColor: string | undefined;
  title: string;
  children?: React.ReactNode;
  onColorSelect: (selectedColor: string) => void;
};

export const PopupStrokeButton: React.FC<PopupStrokeButtonProps> = ({
  board,
  currentColor,
  title,
  children,
  onColorSelect,
}) => {
  const [isStrokePropertyOpen, setIsStrokePropertyOpen] = useState(false);
  const hexColor = currentColor && removeHexAlpha(currentColor);
  const container = PlaitBoard.getBoardContainer(board);

  let icon = isTransparent(hexColor)
    ? StrokeIcon
    : isWhite(hexColor)
    ? StrokeWhiteIcon
    : undefined;

  return (
    <>
      <Popover
        sideOffset={12}
        open={isStrokePropertyOpen}
        onOpenChange={(open) => {
          setIsStrokePropertyOpen(open);
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
              setIsStrokePropertyOpen(!isStrokePropertyOpen);
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
    </>
  );
};
