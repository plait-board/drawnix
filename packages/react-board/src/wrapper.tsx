import {
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
  PlaitBoard,
  type PlaitPlugin,
  type PlaitBoardOptions,
  type Selection,
  ThemeColorMode,
  PlaitOperation,
  PlaitTheme,
  withI18n,
  FLUSHING,
  BoardTransforms,
} from '@plait/core';
import { BoardChangeData } from './plugins/board';
import { useCallback, useEffect, useRef, useState } from 'react';
import { withReact } from './plugins/with-react';
import { withImage, withText } from '@plait/common';
import { BoardContext, BoardContextValue } from './hooks/use-board';
import React from 'react';
import { withPinchZoom } from './plugins/with-pinch-zoom-plugin';
import { useBoardChange } from './hooks/use-board-change';

export type WrapperProps = {
  value: PlaitElement[];
  children: React.ReactNode;
  options: PlaitBoardOptions;
  plugins: PlaitPlugin[];
  viewport?: Viewport;
  theme?: PlaitTheme;
  onChange?: (data: BoardChangeData) => void;
  onSelectionChange?: (selection: Selection | null) => void;
  onValueChange?: (value: PlaitElement[]) => void;
  onViewportChange?: (value: Viewport) => void;
  onThemeChange?: (value: ThemeColorMode) => void;
};

export const Wrapper: React.FC<WrapperProps> = ({
  value,
  children,
  options,
  plugins,
  viewport,
  theme,
  onChange,
  onSelectionChange,
  onValueChange,
  onViewportChange,
  onThemeChange,
}) => {
  const [context, setContext] = useState<BoardContextValue>(() => {
    const board = initializeBoard(value, options, plugins, viewport, theme);
    const listRender = initializeListRender(board);
    return {
      v: 0,
      board,
      listRender,
    };
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

    const hasSelectionChanged = board.operations.some((o) =>
      PlaitOperation.isSetSelectionOperation(o)
    );
    const hasViewportChanged = board.operations.some((o) =>
      PlaitOperation.isSetViewportOperation(o)
    );
    const hasThemeChanged = board.operations.some((o) => PlaitOperation.isSetThemeOperation(o));
    const hasChildrenChanged =
      board.operations.length > 0 &&
      !board.operations.every(
        (o) =>
          PlaitOperation.isSetSelectionOperation(o) ||
          PlaitOperation.isSetViewportOperation(o) ||
          PlaitOperation.isSetThemeOperation(o)
      );

    if (onValueChange && hasChildrenChanged) {
      onValueChange(board.children);
    }

    if (onSelectionChange && hasSelectionChanged) {
      onSelectionChange(board.selection);
    }

    if (onViewportChange && hasViewportChanged) {
      onViewportChange(board.viewport);
    }

    if (onThemeChange && hasThemeChanged) {
      onThemeChange(board.theme.themeColorMode);
    }

    setContext((prevContext) => ({
      v: prevContext.v + 1,
      board,
      listRender,
    }));
  }, [
    board,
    listRender,
    onChange,
    onSelectionChange,
    onThemeChange,
    onValueChange,
    onViewportChange,
  ]);

  useBoardChange(board, listRender, onContextChange);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (value !== context.board.children && !FLUSHING.get(board)) {
      board.children = value;
      if (theme) {
        board.theme = theme;
      }
      listRender.update(board.children, {
        board: board,
        parent: board,
        parentG: PlaitBoard.getElementHost(board),
      });
      BoardTransforms.fitViewport(board);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <BoardContext.Provider value={context}>{children}</BoardContext.Provider>;
};

const initializeBoard = (
  value: PlaitElement[],
  options: PlaitBoardOptions,
  plugins: PlaitPlugin[],
  viewport?: Viewport,
  theme?: PlaitTheme
) => {
  let board = withRelatedFragment(
    withHotkey(
      withHandPointer(
        withHistory(
          withSelection(
            withMoving(
              withBoard(
                withI18n(withOptions(withReact(withImage(withText(createBoard(value, options))))))
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

  withPinchZoom(board);

  if (viewport) {
    board.viewport = viewport;
  }

  if (theme) {
    board.theme = theme;
  }

  return board;
};

const initializeListRender = (board: PlaitBoard) => {
  const listRender = new ListRender(board);
  return listRender;
};
