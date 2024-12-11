import React, { useState } from 'react';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import { ATTACHED_ELEMENT_CLASS_NAME, PlaitBoard } from '@plait/core';
import { Island } from '../../island';
import { ColorPicker } from '../../color-picker';
import {
  hexAlphaToOpacity,
  isFullyTransparent,
  isWhite,
  removeHexAlpha,
} from '../../../utils/color';
import {
  StrokeIcon,
  StrokeStyleDashedIcon,
  StrokeStyleDotedIcon,
  StrokeStyleNormalIcon,
  StrokeWhiteIcon,
} from '../../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import Stack from '../../stack';
import { PropertyTransforms, StrokeStyle } from '@plait/common';
import { getMemorizeKey } from '@plait/draw';
import {
  setStrokeColor,
  setStrokeColorOpacity,
} from '../../../transforms/property';

export type PopupStrokeButtonProps = {
  board: PlaitBoard;
  currentColor: string | undefined;
  title: string;
  hasStrokeStyle: boolean;
  children?: React.ReactNode;
};

export const PopupStrokeButton: React.FC<PopupStrokeButtonProps> = ({
  board,
  currentColor,
  title,
  hasStrokeStyle,
  children,
}) => {
  const [isStrokePropertyOpen, setIsStrokePropertyOpen] = useState(false);
  const hexColor = currentColor && removeHexAlpha(currentColor);
  const opacity = currentColor ? hexAlphaToOpacity(currentColor) : 100;
  const container = PlaitBoard.getBoardContainer(board);

  const icon = isFullyTransparent(opacity)
    ? StrokeIcon
    : isWhite(hexColor)
    ? StrokeWhiteIcon
    : undefined;

  const setStrokeStyle = (style: StrokeStyle) => {
    PropertyTransforms.setStrokeStyle(board, style, { getMemorizeKey });
  };

  return (
    <Popover
      sideOffset={12}
      open={isStrokePropertyOpen}
      onOpenChange={(open) => {
        setIsStrokePropertyOpen(open);
      }}
      placement={'top'}
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
          className={classNames(
            `${ATTACHED_ELEMENT_CLASS_NAME}`,
            'stroke-setting',
            { 'has-stroke-style': hasStrokeStyle }
          )}
        >
          <Stack.Col>
            {hasStrokeStyle && (
              <Stack.Row className={classNames('stroke-style-picker')}>
                <ToolButton
                  visible={true}
                  icon={StrokeStyleNormalIcon}
                  type="button"
                  title={title}
                  aria-label={title}
                  onPointerUp={() => {
                    setStrokeStyle(StrokeStyle.solid);
                  }}
                ></ToolButton>
                <ToolButton
                  visible={true}
                  icon={StrokeStyleDashedIcon}
                  type="button"
                  title={title}
                  aria-label={title}
                  onPointerUp={() => {
                    setStrokeStyle(StrokeStyle.dashed);
                  }}
                ></ToolButton>
                <ToolButton
                  visible={true}
                  icon={StrokeStyleDotedIcon}
                  type="button"
                  title={title}
                  aria-label={title}
                  onPointerUp={() => {
                    setStrokeStyle(StrokeStyle.dotted);
                  }}
                ></ToolButton>
              </Stack.Row>
            )}
            <ColorPicker
              onColorChange={(selectedColor: string) => {
                setStrokeColor(board, selectedColor);
              }}
              onOpacityChange={(opacity: number) => {
                setStrokeColorOpacity(board, opacity);
              }}
              currentColor={currentColor}
            ></ColorPicker>
          </Stack.Col>
        </Island>
      </PopoverContent>
    </Popover>
  );
};
