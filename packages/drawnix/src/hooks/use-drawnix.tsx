/**
 * A React context for sharing the board object, in a way that re-renders the
 * context whenever changes occur.
 */

import { PlaitPointerType } from '@plait/core';
import { createContext, useContext } from 'react';
import { MindPointerType } from '@plait/mind';
import { DrawPointerType } from '@plait/draw';
import { FreehandShape } from '../plugins/freehand/type';

export type DrawnixPointerType =
  | PlaitPointerType
  | MindPointerType
  | DrawPointerType
  | FreehandShape;

export type DrawnixState = {
  pointer: DrawnixPointerType;
  isMobile: boolean;
  isPencilMode: boolean;
};

export const DrawnixContext = createContext<{
  appState: DrawnixState;
  setAppState: (appState: DrawnixState) => void;
} | null>(null);

export const useDrawnix = (): {
  appState: DrawnixState;
  setAppState: (appState: DrawnixState) => void;
} => {
  const context = useContext(DrawnixContext);

  if (!context) {
    throw new Error(
      `The \`useDrawnix\` hook must be used inside the <Drawnix> component's context.`
    );
  }

  return context;
};

export const useSetPointer = () => {
  const { appState, setAppState } = useDrawnix();
  return (pointer: DrawnixPointerType) => {
    setAppState({ ...appState, pointer });
  };
};
