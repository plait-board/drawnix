import { Board, BoardChangeData, Wrapper } from '@plait/react-board';
import {
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  PlaitPointerType,
  Selection,
  ThemeColorMode,
  Viewport,
} from '@plait/core';
import React, { useState } from 'react';
import { withGroup } from '@plait/common';
import { DrawPointerType, withDraw } from '@plait/draw';
import { MindPointerType, withMind } from '@plait/mind';
import { withMindExtend } from './plugins/with-mind-extend';
import { withCommonPlugin } from './plugins/with-common';
import { DrawToolbar } from './components/toolbar/draw-toolbar';

import './styles/index.scss';
import { MainMenu } from './components/main-menu/main-menu';

export type DrawnixProps = {
  value: PlaitElement[];
  onChange?: (value: PlaitElement[]) => void;
  onSelectionChange?: (selection: Selection) => void;
  onValueChange?: (value: PlaitElement[]) => void;
  onViewportChange?: (value: Viewport) => void;
  onThemeChange?: (value: ThemeColorMode) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export type DrawnixPointerType =
  | PlaitPointerType
  | MindPointerType
  | DrawPointerType;

export type DrawnixState = {
  pointer: DrawnixPointerType;
};

export const Drawnix: React.FC<DrawnixProps> = ({ value, onChange }) => {
  const plugins: PlaitPlugin[] = [
    withDraw,
    withGroup,
    withMind,
    withMindExtend,
    withCommonPlugin,
  ];
  const options: PlaitBoardOptions = {};

  const [appState, setAppState] = useState<DrawnixState>(() => {
    // TODO: need to consider how to maintenance the pointer state in future
    return { pointer: PlaitPointerType.hand };
  });

  return (
    <div className="drawnix">
      <Wrapper
        value={value}
        options={options}
        plugins={plugins}
        onChange={(data: BoardChangeData) => {
          console.log(JSON.stringify(data));
        }}
      >
        <Board></Board>
        <MainMenu></MainMenu>
        <DrawToolbar
          setPointer={(pointer: DrawnixPointerType) => {
            setAppState({ pointer });
          }}
        ></DrawToolbar>
      </Wrapper>
    </div>
  );
};
