import { Board, BoardChangeData, Wrapper } from '@plait-board/react-board';
import {
  PlaitBoard,
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  PlaitPointerType,
  PlaitTheme,
  Selection,
  ThemeColorMode,
  Viewport,
} from '@plait/core';
import React, { useState, useRef } from 'react';
import { withGroup } from '@plait/common';
import { withDraw } from '@plait/draw';
import { MindThemeColors, withMind } from '@plait/mind';
import MobileDetect from 'mobile-detect';
import { withMindExtend } from './plugins/with-mind-extend';
import { withCommonPlugin } from './plugins/with-common';
import { CreationToolbar } from './components/toolbar/creation-toolbar';
import { ZoomToolbar } from './components/toolbar/zoom-toolbar';
import { PopupToolbar } from './components/toolbar/popup-toolbar/popup-toolbar';
import { AppToolbar } from './components/toolbar/app-toolbar/app-toolbar';
import classNames from 'classnames';
import './styles/index.scss';
import { buildDrawnixHotkeyPlugin } from './plugins/with-hotkey';
import { withFreehand } from './plugins/freehand/with-freehand';
import { ThemeToolbar } from './components/toolbar/theme-toolbar';
import { buildPencilPlugin } from './plugins/with-pencil';
import { DrawnixContext, DrawnixState } from './hooks/use-drawnix';
import { ClosePencilToolbar } from './components/toolbar/pencil-mode-toolbar';
import { TTDDialog } from './components/ttd-dialog/ttd-dialog';
import { CleanConfirm } from './components/clean-confirm/clean-confirm';

export type DrawnixProps = {
  value: PlaitElement[];
  viewport?: Viewport;
  theme?: PlaitTheme;
  onChange?: (value: BoardChangeData) => void;
  onSelectionChange?: (selection: Selection | null) => void;
  onValueChange?: (value: PlaitElement[]) => void;
  onViewportChange?: (value: Viewport) => void;
  onThemeChange?: (value: ThemeColorMode) => void;
  afterInit?: (board: PlaitBoard) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const Drawnix: React.FC<DrawnixProps> = ({
  value,
  viewport,
  theme,
  onChange,
  onSelectionChange,
  onViewportChange,
  onThemeChange,
  onValueChange,
  afterInit,
}) => {
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
      isPencilMode: false,
      openDialog: false,
      openCleanConfirm: false,
    };
  });

  const plugins: PlaitPlugin[] = [
    withDraw,
    withGroup,
    withMind,
    withMindExtend,
    withCommonPlugin,
    buildDrawnixHotkeyPlugin(appState, setAppState),
    withFreehand,
    buildPencilPlugin(appState, setAppState),
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <DrawnixContext.Provider value={{ appState, setAppState }}>
      <div
        className={classNames('drawnix', {
          'drawnix--mobile': appState.isMobile,
        })}
        ref={containerRef}
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
          onSelectionChange={onSelectionChange}
          onViewportChange={onViewportChange}
          onThemeChange={onThemeChange}
          onValueChange={onValueChange}
        >
          <Board afterInit={afterInit}></Board>
          <AppToolbar></AppToolbar>
          <CreationToolbar></CreationToolbar>
          <ZoomToolbar></ZoomToolbar>
          <ThemeToolbar></ThemeToolbar>
          <PopupToolbar></PopupToolbar>
          <ClosePencilToolbar></ClosePencilToolbar>
          <TTDDialog container={containerRef.current}></TTDDialog>
          <CleanConfirm container={containerRef.current}></CleanConfirm>
        </Wrapper>
      </div>
    </DrawnixContext.Provider>
  );
};
