import { Board, BoardChangeData } from '@plait/react-board';
import type { PlaitBoardOptions, PlaitElement, PlaitPlugin } from '@plait/core';
import React from 'react';
import { withGroup } from '@plait/common';
import { withDraw } from '@plait/draw';
import { withMind } from '@plait/mind';
import { withMindExtend } from './plugins/with-mind-extend';
import { withCommonPlugin } from './plugins/with-common';

import './styles/index.scss';

export type DrawnixBoardProps = {
  value: PlaitElement[];
} & React.HTMLAttributes<HTMLDivElement>;

export const DrawnixBoard: React.FC<DrawnixBoardProps> = (
  props: DrawnixBoardProps
) => {
  const { value } = props;

  const plugins: PlaitPlugin[] = [
    withDraw,
    withGroup,
    withMind,
    withMindExtend,
    withCommonPlugin,
  ];
  const options: PlaitBoardOptions = {};

  return (
    <Board
      value={value}
      options={options}
      plugins={plugins}
      onChange={(data: BoardChangeData) => {
        console.log(data);
      }}
    ></Board>
  );
};
