import React, { ReactNode, useState } from 'react';
import { ColorPicker } from '../../color-picker';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import { Island } from '../../island';
import { ATTACHED_ELEMENT_CLASS_NAME, PlaitBoard } from '@plait/core';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';

export type PopupFontColorButtonProps = {
  board: PlaitBoard;
  currentColor: string | undefined;
  fontColorIcon: ReactNode;
  title: string;
  onSelect: (selectedColor: string) => void;
};

export const PopupFontColorButton: React.FC<PopupFontColorButtonProps> = ({
  board,
  currentColor,
  fontColorIcon,
  title,
  onSelect,
}) => {
  const [isFontColorPropertyOpen, setIsFontColorPropertyOpen] = useState(false);
  const container = PlaitBoard.getBoardContainer(board);

  return (
    <Popover
        sideOffset={12}
        open={isFontColorPropertyOpen}
        onOpenChange={(open) => {
          setIsFontColorPropertyOpen(open);
        }}
        placement={'top'}
      >
        <PopoverTrigger asChild>
          <ToolButton
            className={classNames(`property-button`)}
            selected={isFontColorPropertyOpen}
            visible={true}
            icon={fontColorIcon}
            type="button"
            title={title}
            aria-label={title}
            onPointerUp={() => {
              setIsFontColorPropertyOpen(!isFontColorPropertyOpen);
            }}
          ></ToolButton>
        </PopoverTrigger>
        <PopoverContent container={container}>
          <Island
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
        </PopoverContent>
      </Popover>
  );
};
