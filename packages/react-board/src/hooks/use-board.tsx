/**
 * A React context for sharing the board object, in a way that re-renders the
 * context whenever changes occur.
 */

import { ListRender, PlaitBoard } from '@plait/core';
import { createContext, useContext } from 'react';

export interface BoardContextValue {
  v: number;
  board: PlaitBoard;
  listRender: ListRender;
}

export const BoardContext = createContext<{
  v: number;
  board: PlaitBoard;
  listRender: ListRender;
} | null>(null);

export const useBoard = (): PlaitBoard => {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error(
      `The \`useBoard\` hook must be used inside the <Plait> component's context.`
    );
  }

  const { board } = context;
  return board;
};

export const useListRender = (): ListRender => {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error(
      `The \`useBoard\` hook must be used inside the <Plait> component's context.`
    );
  }

  const { listRender } = context;
  return listRender;
};
