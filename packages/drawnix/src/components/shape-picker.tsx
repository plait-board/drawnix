import classNames from 'classnames';
import { Island } from './island';
import Stack from './stack';
import { ToolButton } from './tool-button';
import {
  HandIcon,
  MindIcon,
  SelectionIcon,
  ShapeIcon,
  TextIcon,
  StraightArrowLineIcon,
  RectangleIcon,
} from './icons';
import { useBoard } from '@plait/react-board';
import { PlaitBoard } from '@plait/core';
import * as Popover from '@radix-ui/react-popover';

import './shape-picker.scss';

export type ShapePickerProps = {};

export const ShapePickerPopupContent: React.FC<ShapePickerProps> = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  return (
    <Popover.Portal container={container}>
      <Popover.Content className="island" sideOffset={12}>
        <ToolButton
          className={classNames('Shape', { fillable: false })}
          type="icon"
          size={'small'}
          visible={true}
          icon={RectangleIcon}
          title={`Shape`}
          aria-label={`Shape`}
        /><ToolButton
        className={classNames('Shape', { fillable: false })}
        type="icon"
        size={'small'}
        visible={true}
        icon={RectangleIcon}
        title={`Shape`}
        aria-label={`Shape`}
      /><ToolButton
      className={classNames('Shape', { fillable: false })}
      type="icon"
      size={'small'}
      visible={true}
      icon={RectangleIcon}
      title={`Shape`}
      aria-label={`Shape`}
    /><ToolButton
    className={classNames('Shape', { fillable: false })}
    type="icon"
    size={'small'}
    visible={true}
    icon={RectangleIcon}
    title={`Shape`}
    aria-label={`Shape`}
  /><ToolButton
  className={classNames('Shape', { fillable: false })}
  type="icon"
  size={'small'}
  visible={true}
  icon={RectangleIcon}
  title={`Shape`}
  aria-label={`Shape`}
/>
      </Popover.Content>
    </Popover.Portal>
  );
};
