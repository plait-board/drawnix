import { BOARD_TO_ELEMENT_HOST, createG, createTestingBoard, PlaitBoard } from '@plait/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FreehandComponent } from './freehand.component';
import { Freehand, FreehandShape } from './type';

describe('FreehandComponent', () => {
  let board: PlaitBoard;

  afterEach(() => {
    vi.restoreAllMocks();
    BOARD_TO_ELEMENT_HOST.delete(board);
  });

  it('refreshes its active section on request', () => {
    const element = {
      id: 'freehand',
      type: 'freehand',
      shape: FreehandShape.feltTipPen,
      points: [
        [0, 0],
        [10, 10],
      ],
    } as Freehand;
    board = createTestingBoard([], [element]);
    const activeHost = createG();
    BOARD_TO_ELEMENT_HOST.set(board, {
      lowerHost: createG(),
      host: createG(),
      upperHost: createG(),
      topHost: createG(),
      activeHost,
      container: document.createElement('div'),
      viewportContainer: document.createElement('div'),
    });
    const component = new FreehandComponent();
    component.context = {
      board,
      element,
      parent: board,
      index: 0,
      selected: true,
      hasThemeChanged: false,
    };
    component.initializeGenerator();
    const processDrawing = vi
      .spyOn(component.activeGenerator, 'processDrawing')
      .mockImplementation(() => {});

    board.viewport.zoom = 2;
    component.getRef().updateActiveSection();

    expect(processDrawing).toHaveBeenCalledOnce();
    expect(processDrawing).toHaveBeenCalledWith(element, activeHost, {
      selected: true,
    });
  });
});
