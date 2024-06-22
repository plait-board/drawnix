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
  afterInitialize?: (board: PlaitBoard) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export const Board: React.FC<PlaitBoardProps> = ({ style, className }) => {
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

    if (!listRender.initialized) {
      listRender.initialize(board.children, {
        board: board,
        parent: board,
        parentG: PlaitBoard.getElementHost(board),
      });
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
    };
  }, []);

  useBoardPluginEvent(board, hostRef);
  useBoardEvent(board, hostRef);

  return (
    <div
      className={getBoardClassName(board) + ' ' + className}
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
      </div>
    </div>
  );
};

const getBoardClassName = (board: PlaitBoard) => {
  return classNames(
    HOST_CLASS_NAME,
    `${getBrowserClassName()}`,
    `pointer-${board.pointer}`,
    `theme-${board.theme?.themeColorMode}`,
    {
      focused: PlaitBoard.isFocus(board),
      readonly: PlaitBoard.isReadonly(board),
      'disabled-scroll':
        board.options?.disabledScrollOnNonFocus && !PlaitBoard.isFocus(board),
    }
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
