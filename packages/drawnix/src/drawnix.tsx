import { Board, BoardChangeData, Wrapper } from '@plait-board/react-board';
import {
  PlaitBoard,
  PlaitBoardOptions,
  PlaitElement,
  PlaitPlugin,
  PlaitPointerType,
  PlaitTheme,
  BoardTransforms,
  Selection,
  ThemeColorMode,
  Viewport,
} from '@plait/core';
import React, { useState, useRef, useEffect } from 'react';
import { BoardCreationMode, setCreationMode, withGroup } from '@plait/common';
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
import {
  DrawnixBoard,
  DrawnixContext,
  DrawnixState,
  DrawnixToolState,
  mergeToolState,
} from './hooks/use-drawnix';
import { ClosePencilToolbar } from './components/toolbar/pencil-mode-toolbar';
import { TTDDialog } from './components/ttd-dialog/ttd-dialog';
import { CleanConfirm } from './components/clean-confirm/clean-confirm';
import { buildTextLinkPlugin } from './plugins/with-text-link';
import { LinkPopup } from './components/popup/link-popup/link-popup';
import { I18nProvider } from './i18n';
import { Tutorial } from './components/tutorial';
import { LASER_POINTER_CLASS_NAME } from './utils/laser-pointer';

export type DrawnixProps = {
  value: PlaitElement[];
  viewport?: Viewport;
  theme?: PlaitTheme;
  initialToolState?: Partial<DrawnixToolState>;
  onChange?: (value: BoardChangeData) => void;
  onSelectionChange?: (selection: Selection | null) => void;
  onValueChange?: (value: PlaitElement[]) => void;
  onViewportChange?: (value: Viewport) => void;
  onThemeChange?: (value: ThemeColorMode) => void;
  onToolStateChange?: (toolState: DrawnixToolState) => void;
  afterInit?: (board: PlaitBoard) => void;
  tutorial?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export type { DrawnixToolState } from './hooks/use-drawnix';

const applyToolStateToBoard = (board: PlaitBoard, toolState: DrawnixToolState) => {
  BoardTransforms.updatePointerType(board, toolState.pointer);
  if (
    toolState.pointer !== PlaitPointerType.hand &&
    toolState.pointer !== PlaitPointerType.selection
  ) {
    setCreationMode(board, BoardCreationMode.drawing);
  }
};

export const Drawnix: React.FC<DrawnixProps> = ({
  value,
  viewport,
  theme,
  initialToolState,
  onChange,
  onSelectionChange,
  onViewportChange,
  onThemeChange,
  onValueChange,
  onToolStateChange,
  afterInit,
  tutorial = false,
}) => {
  const options: PlaitBoardOptions = {
    readonly: false,
    hideScrollbar: false,
    disabledScrollOnNonFocus: false,
    themeColors: MindThemeColors,
  };

  const [appState, setAppState] = useState<DrawnixState>(() => {
    const md = new MobileDetect(window.navigator.userAgent);
    return {
      toolState: mergeToolState(initialToolState),
      isMobile: md.mobile() !== null,
      isPencilMode: false,
      fileHandle: null,
      openDialogType: null,
      openCleanConfirm: false,
    };
  });

  const [board, setBoard] = useState<DrawnixBoard | null>(null);

  if (board) {
    board.appState = appState;
  }

  const hasMountedToolStateRef = useRef(false);
  const onToolStateChangeRef = useRef(onToolStateChange);
  onToolStateChangeRef.current = onToolStateChange;

  useEffect(() => {
    if (!hasMountedToolStateRef.current) {
      hasMountedToolStateRef.current = true;
      return;
    }
    onToolStateChangeRef.current?.(appState.toolState);
  }, [appState.toolState]);

  const updateAppState = (newAppState: Partial<DrawnixState>) => {
    setAppState((currentAppState) => ({
      ...currentAppState,
      ...newAppState,
    }));
  };

  const plugins: PlaitPlugin[] = [
    withDraw,
    withGroup,
    withMind,
    withMindExtend,
    withCommonPlugin,
    buildDrawnixHotkeyPlugin(updateAppState),
    withFreehand,
    buildPencilPlugin(updateAppState),
    buildTextLinkPlugin(updateAppState),
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <I18nProvider>
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
              onChange?.(data);
            }}
            onSelectionChange={onSelectionChange}
            onViewportChange={onViewportChange}
            onThemeChange={onThemeChange}
            onValueChange={onValueChange}
          >
            <Board
              afterInit={(board) => {
                const drawnixBoard = board as DrawnixBoard;
                applyToolStateToBoard(drawnixBoard, appState.toolState);
                setBoard(drawnixBoard);
                afterInit?.(board);
              }}
            >
              {tutorial && board && <Tutorial />}
            </Board>
            <AppToolbar></AppToolbar>
            <CreationToolbar></CreationToolbar>
            <ZoomToolbar></ZoomToolbar>
            <ThemeToolbar></ThemeToolbar>
            <PopupToolbar></PopupToolbar>
            <LinkPopup></LinkPopup>
            <ClosePencilToolbar></ClosePencilToolbar>
            <TTDDialog container={containerRef.current}></TTDDialog>
            <CleanConfirm container={containerRef.current}></CleanConfirm>
          </Wrapper>
          <canvas className={`${LASER_POINTER_CLASS_NAME} mouse-course-hidden`}></canvas>
        </div>
      </DrawnixContext.Provider>
    </I18nProvider>
  );
};
