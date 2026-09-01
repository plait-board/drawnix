import { BoardCreationMode, setCreationMode } from '@plait/common';
import { BoardTransforms, setupTestingBoard } from '@plait/core';
import type {
  PlaitElement,
  PlaitPlugin,
  SetupTestingBoardOptions,
  TestingBoardFixture,
} from '@plait/core';
import { mergeToolState } from '../src/hooks/use-drawnix';
import type {
  DrawnixBoard,
  DrawnixPointerType,
  DrawnixState,
  DrawnixToolState,
} from '../src/hooks/use-drawnix';

export type DrawnixTestingAppStateOverrides = Partial<Omit<DrawnixState, 'toolState'>> & {
  toolState?: Partial<DrawnixToolState>;
};

export interface SetupDrawnixTestingBoardOptions extends SetupTestingBoardOptions {
  appState?: DrawnixTestingAppStateOverrides;
  pointer?: DrawnixPointerType;
  creationMode?: BoardCreationMode;
}

export interface DrawnixTestingBoardFixture extends Omit<TestingBoardFixture, 'board'> {
  board: DrawnixBoard;
}

const createTestingAppState = (overrides: DrawnixTestingAppStateOverrides = {}): DrawnixState => {
  const { toolState, ...stateOverrides } = overrides;

  return {
    toolState: mergeToolState(toolState),
    isMobile: false,
    isPencilMode: false,
    fileHandle: null,
    openDialogType: null,
    openCleanConfirm: false,
    copyTransparent: false,
    exportTransparent: false,
    ...stateOverrides,
  };
};

export const setupDrawnixTestingBoard = (
  plugins: PlaitPlugin[],
  children: PlaitElement[] = [],
  options: SetupDrawnixTestingBoardOptions = {}
): DrawnixTestingBoardFixture => {
  const { appState, pointer, creationMode, ...testingBoardOptions } = options;
  const initializeDrawnixState: PlaitPlugin = (board) => {
    const drawnixBoard = board as DrawnixBoard;
    drawnixBoard.appState = createTestingAppState(appState);

    if (pointer !== undefined) {
      BoardTransforms.updatePointerType(drawnixBoard, pointer);
    }
    if (creationMode !== undefined) {
      setCreationMode(drawnixBoard, creationMode);
    }

    return drawnixBoard;
  };

  const fixture = setupTestingBoard(
    [initializeDrawnixState, ...plugins],
    children,
    testingBoardOptions
  );

  return {
    ...fixture,
    board: fixture.board as DrawnixBoard,
  };
};
