import { Board, BoardChangeData, PlaitWrapper } from '@plait/react-board';
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
import { AppToolbar } from './components/AppToolbar';

import './styles/index.scss';

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
    return { pointer: PlaitPointerType.hand };
  });

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
        <Board className={`pointer-${appState.pointer}`}></Board>
        <AppToolbar
          setPointer={(pointer: DrawnixPointerType) => {
            setAppState({ pointer });
          }}
        ></AppToolbar>
      </PlaitWrapper>
    </div>
  );
};
