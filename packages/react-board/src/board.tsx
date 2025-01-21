import rough from 'roughjs/bin/rough';
import {
  BOARD_TO_AFTER_CHANGE,
  BOARD_TO_CONTEXT,
  BOARD_TO_ELEMENT_HOST,
  BOARD_TO_HOST,
  BOARD_TO_ON_CHANGE,
  BOARD_TO_ROUGH_SVG,
  HOST_CLASS_NAME,
  IS_BOARD_ALIVE,
  IS_CHROME,
  IS_FIREFOX,
  IS_SAFARI,
  PlaitBoardContext,
  initializeViewBox,
  initializeViewportContainer,
  initializeViewportOffset,
  PlaitBoard,
  KEY_TO_ELEMENT_MAP,
} from '@plait/core';
import { useRef, useEffect } from 'react';
import React from 'react';
import classNames from 'classnames';
import useBoardPluginEvent from './hooks/use-plugin-event';
import useBoardEvent from './hooks/use-board-event';

import './styles/index.scss';
import { useBoard, useListRender } from './hooks/use-board';

export type PlaitBoardProps = {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  afterInit?: (board: PlaitBoard) => void;
};

export const Board: React.FC<PlaitBoardProps> = ({
  style,
  className,
  children,
  afterInit,
}) => {
  const hostRef = useRef<SVGSVGElement>(null);
  const elementLowerHostRef = useRef<SVGGElement>(null);
  const elementHostRef = useRef<SVGGElement>(null);
  const elementUpperHostRef = useRef<SVGGElement>(null);
  const elementActiveHostRef = useRef<SVGGElement>(null);
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  const board = useBoard();
  const listRender = useListRender();

  useEffect(() => {
    const roughSVG = rough.svg(hostRef.current!, {
      options: { roughness: 0, strokeWidth: 1 },
    });
    BOARD_TO_ROUGH_SVG.set(board, roughSVG);
    BOARD_TO_HOST.set(board, hostRef.current!);
    IS_BOARD_ALIVE.set(board, true);
    BOARD_TO_ELEMENT_HOST.set(board, {
      lowerHost: elementLowerHostRef.current!,
      host: elementHostRef.current!,
      upperHost: elementUpperHostRef.current!,
      activeHost: elementActiveHostRef.current!,
      container: boardContainerRef.current!,
      viewportContainer: viewportContainerRef.current!,
    });
    const context = new PlaitBoardContext();
    BOARD_TO_CONTEXT.set(board, context);
    KEY_TO_ELEMENT_MAP.set(board, new Map());

    if (!listRender.initialized) {
      listRender.initialize(board.children, {
        board: board,
        parent: board,
        parentG: PlaitBoard.getElementHost(board),
      });
      if (afterInit) {
        afterInit(board);
      }
    }

    initializeViewportContainer(board);
    initializeViewBox(board);
    initializeViewportOffset(board);

    return () => {
      BOARD_TO_CONTEXT.delete(board);
      BOARD_TO_AFTER_CHANGE.delete(board);
      BOARD_TO_ON_CHANGE.delete(board);
      BOARD_TO_ELEMENT_HOST.delete(board);
      IS_BOARD_ALIVE.delete(board);
      BOARD_TO_HOST.delete(board);
      BOARD_TO_ROUGH_SVG.delete(board);
      KEY_TO_ELEMENT_MAP.delete(board);
    };
  }, []);

  useBoardPluginEvent(board, viewportContainerRef, hostRef);
  useBoardEvent(board, viewportContainerRef);

  return (
    <div
      className={classNames(
        className,
        HOST_CLASS_NAME,
        `${getBrowserClassName()}`,
        `theme-${board.theme?.themeColorMode}`,
        `pointer-${board.pointer}`,
        {
          focused: PlaitBoard.isFocus(board),
          readonly: PlaitBoard.isReadonly(board),
          'disabled-scroll':
            board.options?.disabledScrollOnNonFocus &&
            !PlaitBoard.isFocus(board),
        }
      )}
      ref={boardContainerRef}
      style={style}
    >
      <div
        className="viewport-container"
        ref={viewportContainerRef}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
      >
        <svg
          ref={hostRef}
          width="100%"
          height="100%"
          style={{ position: 'relative' }}
          className="board-host-svg"
        >
          <g className="element-lower-host" ref={elementLowerHostRef}></g>
          <g className="element-host" ref={elementHostRef}></g>
          <g className="element-upper-host" ref={elementUpperHostRef}></g>
          <g className="element-active-host" ref={elementActiveHostRef}></g>
        </svg>
        {children}
      </div>
    </div>
  );
};

const getBrowserClassName = () => {
  if (IS_SAFARI) {
    return 'safari';
  }
  if (IS_CHROME) {
    return 'chrome';
  }
  if (IS_FIREFOX) {
    return 'firefox';
  }
  return '';
};
