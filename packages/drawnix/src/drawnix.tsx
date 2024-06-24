import { Board, BoardChangeData, PlaitWrapper } from '@plait/react-board';
import type {
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  Selection,
  ThemeColorMode,
  Viewport,
} from '@plait/core';
import React from 'react';
import { withGroup } from '@plait/common';
import { withDraw } from '@plait/draw';
import { withMind } from '@plait/mind';
import { withMindExtend } from './plugins/with-mind-extend';
import { withCommonPlugin } from './plugins/with-common';

import './styles/index.scss';

export type DrawnixBoardProps = {
  value: PlaitElement[];
  onChange?: (value: PlaitElement[]) => void;
  onSelectionChange?: (selection: Selection) => void;
  onValueChange?: (value: PlaitElement[]) => void;
  onViewportChange?: (value: Viewport) => void;
  onThemeChange?: (value: ThemeColorMode) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const DrawnixBoard: React.FC<DrawnixBoardProps> = ({
  value,
  onChange,
}) => {
  const plugins: PlaitPlugin[] = [
    withDraw,
    withGroup,
    withMind,
    withMindExtend,
    withCommonPlugin,
  ];
  const options: PlaitBoardOptions = {};

  return (
    <div className="drawnix">
      <PlaitWrapper
        value={value}
        options={options}
        plugins={plugins}
        onChange={(data: BoardChangeData) => {
          console.log(data);
        }}
      >
        <Board></Board>
      </PlaitWrapper>
    </div>
  );
};
