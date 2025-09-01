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
import { useI18n } from '../../../i18n';

export type PopupStrokeButtonProps = {
  board: PlaitBoard;
  currentColor: string | undefined;
  currentStyle?: StrokeStyle;
  title: string;
  hasStrokeStyle: boolean;
  children?: React.ReactNode;
};

export const PopupStrokeButton: React.FC<PopupStrokeButtonProps> = ({
  board,
  currentColor,
  currentStyle,
  title,
  hasStrokeStyle,
  children,
}) => {
  const [isStrokePropertyOpen, setIsStrokePropertyOpen] = useState(false);
  const hexColor = currentColor && removeHexAlpha(currentColor);
  const opacity = currentColor ? hexAlphaToOpacity(currentColor) : 100;
  const container = PlaitBoard.getBoardContainer(board);
  const { t } = useI18n();

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
                  selected={
                    !currentStyle || currentStyle === StrokeStyle.solid
                  }
                  icon={StrokeStyleNormalIcon}
                  type="button"
                  title={`${title} — ${t('stroke.solid')}`}
                  aria-label={`${title} — ${t('stroke.solid')}`}
                  onPointerUp={() => {
                    setStrokeStyle(StrokeStyle.solid);
                  }}
                ></ToolButton>
                <ToolButton
                  visible={true}
                  selected={currentStyle === StrokeStyle.dashed}
                  icon={StrokeStyleDashedIcon}
                  type="button"
                  title={`${title} — ${t('stroke.dashed')}`}
                  aria-label={`${title} — ${t('stroke.dashed')}`}
                  onPointerUp={() => {
                    setStrokeStyle(StrokeStyle.dashed);
                  }}
                ></ToolButton>
                <ToolButton
                  visible={true}
                  selected={currentStyle === StrokeStyle.dotted}
                  icon={StrokeStyleDotedIcon}
                  type="button"
                  title={`${title} — ${t('stroke.dotted')}`}
                  aria-label={`${title} — ${t('stroke.dotted')}`}
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
