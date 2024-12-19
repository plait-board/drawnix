import { Board, BoardChangeData, Wrapper } from '@plait/react-board';
import {
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  PlaitPointerType,
  PlaitTheme,
  Selection,
  ThemeColorMode,
  Viewport,
} from '@plait/core';
import React, { useState } from 'react';
import { withGroup } from '@plait/common';
import { DrawPointerType, withDraw } from '@plait/draw';
import { MindPointerType, MindThemeColors, withMind } from '@plait/mind';
import MobileDetect from 'mobile-detect';
import { withMindExtend } from './plugins/with-mind-extend';
import { withCommonPlugin } from './plugins/with-common';
import { CreationToolbar } from './components/toolbar/creation-toolbar';
import { ZoomToolbar } from './components/toolbar/zoom-toolbar';
import { PopupToolbar } from './components/toolbar/popup-toolbar/popup-toolbar';
import { AppToolbar } from './components/toolbar/app-toolbar/app-toolbar';
import classNames from 'classnames';
import './styles/index.scss';
import { withDrawnixHotkey } from './plugins/with-hotkey';
import { FreehandShape } from './plugins/freehand/type';
import { withFreehand } from './plugins/freehand/with-freehand';
import { ThemeToolbar } from './components/toolbar/theme-toolbar';

export type DrawnixProps = {
  value: PlaitElement[];
  viewport?: Viewport;
  theme?: PlaitTheme;
  onChange?: (value: BoardChangeData) => void;
  onSelectionChange?: (selection: Selection) => void;
  onValueChange?: (value: PlaitElement[]) => void;
  onViewportChange?: (value: Viewport) => void;
  onThemeChange?: (value: ThemeColorMode) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export type DrawnixPointerType =
  | PlaitPointerType
  | MindPointerType
  | DrawPointerType
  | FreehandShape;

export type DrawnixState = {
  pointer: DrawnixPointerType;
  isMobile: boolean;
};

export const Drawnix: React.FC<DrawnixProps> = ({
  value,
  viewport,
  theme,
  onChange,
}) => {
  const plugins: PlaitPlugin[] = [
    withDraw,
    withGroup,
    withMind,
    withMindExtend,
    withCommonPlugin,
    withDrawnixHotkey,
    withFreehand,
  ];
  const options: PlaitBoardOptions = {
    readonly: false,
    hideScrollbar: false,
    disabledScrollOnNonFocus: false,
    themeColors: MindThemeColors,
  };
  const [appState, setAppState] = useState<DrawnixState>(() => {
    // TODO: need to consider how to maintenance the pointer state in future
    const md = new MobileDetect(window.navigator.userAgent);
    return {
      pointer: PlaitPointerType.hand,
      isMobile: md.mobile() !== null,
    };
  });

  return (
    <div
      className={classNames('drawnix', {
        'drawnix--mobile': appState.isMobile,
      })}
    >
      <Wrapper
        value={value}
        viewport={viewport}
        theme={theme}
        options={options}
        plugins={plugins}
        onChange={(data: BoardChangeData) => {
          onChange && onChange(data);
        }}
      >
        <Board></Board>
        <AppToolbar></AppToolbar>
        <CreationToolbar
          setPointer={(pointer: DrawnixPointerType) => {
            setAppState({ ...appState, pointer });
          }}
        ></CreationToolbar>
        <ZoomToolbar></ZoomToolbar>
        <ThemeToolbar></ThemeToolbar>
        <PopupToolbar></PopupToolbar>
      </Wrapper>
    </div>
  );
};
