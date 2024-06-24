import {
  BOARD_TO_ON_CHANGE,
  ListRender,
  PlaitElement,
  Viewport,
  createBoard,
  withBoard,
  withHandPointer,
  withHistory,
  withHotkey,
  withMoving,
  withOptions,
  withRelatedFragment,
  withSelection,
  withViewport,
  PlaitBoard,
  type PlaitPlugin,
  type PlaitBoardOptions,
  type Selection,
  ThemeColorMode,
  BOARD_TO_AFTER_CHANGE,
  PlaitOperation,
} from '@plait/core';
import { BoardChangeData } from './plugins/board';
import { useCallback, useEffect, useState } from 'react';
import { withReact } from './plugins/with-react';
import { withImage, withText } from '@plait/common';
import { BoardContext, BoardContextValue } from './hooks/use-board';
import React from 'react';

export type PlaitProps = {
  value: PlaitElement[];
  children: React.ReactNode;
  options: PlaitBoardOptions;
  plugins: PlaitPlugin[];
  viewport?: Viewport;
  onChange?: (data: BoardChangeData) => void;
  onSelectionChange?: (selection: Selection | null) => void;
  onValueChange?: (value: PlaitElement[]) => void;
  onViewportChange?: (value: Viewport) => void;
  onThemeChange?: (value: ThemeColorMode) => void;
};

export const PlaitWrapper: React.FC<PlaitProps> = ({
  value,
  children,
  options,
  plugins,
  viewport,
  onChange,
  onSelectionChange,
  onValueChange,
  onViewportChange,
  onThemeChange,
}) => {
  const [context, setContext] = useState<BoardContextValue>(() => {
    const board = initializeBoard(value, options, plugins);
    const listRender = initializeListRender(board);
    return { v: 0, board, listRender };
  });

  const { board, listRender } = context;

  const onContextChange = useCallback(() => {
    if (onChange) {
      const data: BoardChangeData = {
        children: board.children,
        operations: board.operations,
        viewport: board.viewport,
        selection: board.selection,
        theme: board.theme,
      };
      onChange(data);
    }

    if (board.operations.some((o) => PlaitOperation.isSetViewportOperation(o))) {
      onViewportChange?.(board.viewport);
    }

    setContext((prevContext) => ({
      v: prevContext.v + 1,
      board,
      listRender,
    }));
  }, [board, onChange, onSelectionChange, onValueChange]);

  useEffect(() => {
    BOARD_TO_ON_CHANGE.set(board, () => {
      listRender.update(board.children, {
        board: board,
        parent: board,
        parentG: PlaitBoard.getElementHost(board),
      });
    });

    BOARD_TO_AFTER_CHANGE.set(board, () => {
      onContextChange();
    });

    return () => {
      BOARD_TO_ON_CHANGE.set(board, () => {});
      BOARD_TO_AFTER_CHANGE.set(board, () => {});
    };
  }, [board, onContextChange]);

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
};

const initializeBoard = (value: any, options: any, plugins: any) => {
  let board = withRelatedFragment(
    withHotkey(
      withHandPointer(
        withHistory(
          withSelection(
            withMoving(
              withBoard(
                withViewport(
                  withOptions(
                    withReact(withImage(withText(createBoard(value, options))))
                  )
                )
              )
            )
          )
        )
      )
    )
  );
  plugins.forEach((plugin: any) => {
    board = plugin(board);
  });

  // if (this.plaitViewport) {
  //   this.board.viewport = this.plaitViewport;
  // }

  // if (this.plaitTheme) {
  //   this.board.theme = this.plaitTheme;
  // }
  return board;
};

const initializeListRender = (board: PlaitBoard) => {
  const listRender = new ListRender(board);
  return listRender;
};
