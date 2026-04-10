/**
 * A React context for sharing the board object, in a way that re-renders the
 * context whenever changes occur.
 */
import { PlaitBoard, PlaitPointerType } from '@plait/core';
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { MindPointerType } from '@plait/mind';
import { DrawPointerType } from '@plait/draw';
import { FreehandShape } from '../plugins/freehand/type';
import { Editor } from 'slate';
import { LinkElement } from '@plait/common';
import { FreehandDrawOptions } from '../plugins/freehand/presets';

export enum DialogType {
  mermaidToDrawnix = 'mermaidToDrawnix',
  markdownToDrawnix = 'markdownToDrawnix',
}

export type DrawnixPointerType =
  | PlaitPointerType
  | MindPointerType
  | DrawPointerType
  | FreehandShape;

export interface DrawnixBoard extends PlaitBoard {
  appState: DrawnixState;
}

export type LinkState = {
  targetDom: HTMLElement;
  editor: Editor;
  targetElement: LinkElement;
  isEditing: boolean;
  isHovering: boolean;
  isHoveringOrigin: boolean;
};

export type DrawnixState = {
  pointer: DrawnixPointerType;
  isMobile: boolean;
  isPencilMode: boolean;
  freehandPresets: FreehandDrawOptions[];
  activeFreehandPresetIndex: number;
  openDialogType: DialogType | null;
  openCleanConfirm: boolean;
  linkState?: LinkState | null;
};

export const DrawnixContext = createContext<{
  appState: DrawnixState;
  setAppState: Dispatch<SetStateAction<DrawnixState>>;
} | null>(null);

export const useDrawnix = (): {
  appState: DrawnixState;
  setAppState: Dispatch<SetStateAction<DrawnixState>>;
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
  const { setAppState } = useDrawnix();
  return (pointer: DrawnixPointerType) => {
    setAppState((appState) => ({ ...appState, pointer }));
  };
};
