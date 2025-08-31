import React, { useState } from 'react';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import { PlaitBoard } from '@plait/core';
import { ArrowIcon, LineIcon } from '../../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import { ArrowLineHandle } from '@plait/draw';
import { ArrowMarkerPicker } from '../../arrow-mark-picker';
import { useI18n } from '../../../i18n';

export type ArrowMarkButtonProps = {
  board: PlaitBoard;
  endProperty?: ArrowLineHandle;
  children?: React.ReactNode;
  end: 'source' | 'target';
};

export const ArrowMarkButton: React.FC<ArrowMarkButtonProps> = ({
  board,
  end,
  endProperty,
}) => {
  const [isPopoverOpen, setIsPopoverrOpen] = useState(false);
  const marker = endProperty?.marker;
  const container = PlaitBoard.getBoardContainer(board);
  const { t } = useI18n();
  const title = `${t(`line.${end}`)} — ${t(`line.${marker}`)}`;

  return (
    <Popover
      sideOffset={12}
      open={isPopoverOpen}
      onOpenChange={(open) => {
        setIsPopoverrOpen(open);
      }}
      placement={'top'}
    >
      <PopoverTrigger asChild>
        <ToolButton
          className={classNames(
            `property-button  ${end === 'source' ? 'source-arrow-button' : ''}`
          )}
          visible={true}
          icon={marker === 'none' ? LineIcon : ArrowIcon}
          type="button"
          title={title}
          aria-label={title}
          selected={isPopoverOpen}
          onPointerUp={() => {
            setIsPopoverrOpen(!isPopoverOpen);
          }}
        ></ToolButton>
      </PopoverTrigger>
      <PopoverContent container={container}>
        <ArrowMarkerPicker end={end} property={endProperty} />
      </PopoverContent>
    </Popover>
  );
};
