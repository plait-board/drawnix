import classNames from 'classnames';
import { Island } from './island';
import Stack from './stack';
import { ToolButton } from './tool-button';
import { LineIcon, ArrowIcon } from './icons';
import { useBoard } from '@plait-board/react-board';
import { ATTACHED_ELEMENT_CLASS_NAME } from '@plait/core';
import React from 'react';
import { PropertyTransforms } from '@plait/common';
import { ArrowLineHandle } from '@plait/draw';
import { useI18n } from '../i18n';

export type ArrowMarkerPickerProps = {
  end: 'source' | 'target';
  property: ArrowLineHandle;
};

export const ArrowMarkerPicker: React.FC<ArrowMarkerPickerProps> = ({
  end,
  property,
}) => {
  const board = useBoard();
  const { marker: currentMarker } = property;
  const { t } = useI18n();

  const setMarker = (marker: string) => {
    PropertyTransforms.setProperty(board, {
      [end]: {
        ...property,
        marker,
      },
    });
  };

  return (
    <Island
      padding={2}
      className={classNames(
        `${ATTACHED_ELEMENT_CLASS_NAME} ${
          end === 'source' ? 'source-arrow-island' : ''
        } `
      )}
    >
      <Stack.Row gap={1}>
        <ToolButton
          className={classNames(`property-button`)}
          visible={true}
          icon={LineIcon}
          type="button"
          title={t('line.none')}
          aria-label={t('line.none')}
          selected={currentMarker === 'none'}
          onPointerUp={() => {
            setMarker('none');
          }}
        ></ToolButton>
        <ToolButton
          className={classNames(`property-button`)}
          visible={true}
          icon={ArrowIcon}
          type="button"
          title={t('line.arrow')}
          aria-label={t('line.arrow')}
          selected={currentMarker === 'arrow'}
          onPointerUp={() => {
            setMarker('arrow');
          }}
        ></ToolButton>
      </Stack.Row>
    </Island>
  );
};
