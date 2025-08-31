import React, { useState } from 'react';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import { ATTACHED_ELEMENT_CLASS_NAME, PlaitBoard } from '@plait/core';
import { Island } from '../../island';

import {
ArrowIcon,
  LineIcon,
} from '../../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import Stack from '../../stack';
import { PropertyTransforms } from '@plait/common';
import { ArrowLineHandle } from '@plait/draw';

export type PopupFillButtonProps = {
  board: PlaitBoard;
  source?: ArrowLineHandle;
  target?: ArrowLineHandle;
  title: string;
  children?: React.ReactNode;
};

export const PopupArrowButton: React.FC<PopupFillButtonProps> = ({
  board,
  target,
  source,
  title,
}) => {
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const sourceMarker = source?.marker;
  const targetMarker = target?.marker;
  const container = PlaitBoard.getBoardContainer(board);

  const setSourceMarker = (marker: string) => {
    PropertyTransforms.setProperty(board, {
      source: {
        ...source,
        marker,
      },
    });
  };

  const setTargetMarker = (marker: string) => {
    PropertyTransforms.setProperty(board, {
      target: {
        ...target,
        marker,
      },
    });
  };

  return (
    <>
      <Popover
        sideOffset={12}
        open={isSourceOpen}
        onOpenChange={(open) => {
          setIsSourceOpen(open);
        }}
        placement={'top'}
      >
        <PopoverTrigger asChild>
          <ToolButton
            className={classNames(`property-button  source-arrow-button`)}
            visible={true}
            icon={sourceMarker === 'none' ? LineIcon : ArrowIcon}
            type="button"
            title={title}
            aria-label={title}
            onPointerUp={() => {
              setIsSourceOpen(!isSourceOpen);
            }}
          ></ToolButton>
        </PopoverTrigger>
        <PopoverContent container={container}>
          <Island
            padding={2}
            className={classNames(`${ATTACHED_ELEMENT_CLASS_NAME} source-arrow-island`)}
          >
            <Stack.Row gap={1}>
              <ToolButton
                className={classNames(`property-button`)}
                visible={true}
                icon={LineIcon}
                type="button"
                title={title}
                aria-label={title}
                selected={sourceMarker === 'none'}
                onPointerUp={() => {
                  setSourceMarker('none');
                }}
              ></ToolButton>
              <ToolButton
                className={classNames(`property-button`)}
                visible={true}
                icon={ArrowIcon}
                type="button"
                title={title}
                selected={sourceMarker === 'arrow'}
                aria-label={title}
                onPointerUp={() => {
                  setSourceMarker('arrow');
                }}
              ></ToolButton>
            </Stack.Row>
          </Island>
        </PopoverContent>
      </Popover>

      <Popover
        sideOffset={12}
        open={isTargetOpen}
        onOpenChange={(open) => {
          setIsTargetOpen(open);
        }}
        placement={'top'}
      >
        <PopoverTrigger asChild>
          <ToolButton
            className={classNames(`property-button`)}
            visible={true}
            icon={targetMarker === 'none' ? LineIcon : ArrowIcon}
            type="button"
            title={title}
            aria-label={title}
            onPointerUp={() => {
              setIsTargetOpen(!isTargetOpen);
            }}
          ></ToolButton>
        </PopoverTrigger>
        <PopoverContent container={container}>
          <Island
            padding={2}
            className={classNames(`${ATTACHED_ELEMENT_CLASS_NAME}`)}
          >
            <Stack.Row gap={1}>
              <ToolButton
                className={classNames(`property-button`)}
                visible={true}
                icon={LineIcon}
                type="button"
                title={title}
                aria-label={title}
                selected={targetMarker === 'none'}
                onPointerUp={() => {
                  setTargetMarker('none');
                }}
              ></ToolButton>
              <ToolButton
                className={classNames(`property-button`)}
                visible={true}
                icon={ArrowIcon}
                type="button"
                title={title}
                aria-label={title}
                selected={targetMarker === 'arrow'}
                onPointerUp={() => {
                  setTargetMarker('arrow');
                }}
              ></ToolButton>
            </Stack.Row>
          </Island>
        </PopoverContent>
      </Popover>
    </>
  );
};
