import { BoardCreationMode } from '@plait/common';
import { POINTER_BUTTON, createBoardEventObserver, createPointerEvent } from '@plait/core';
import { afterEach, describe, expect, it } from 'vitest';
import { setupDrawnixTestingBoard } from '../../../testing';
import type { DrawnixTestingBoardFixture } from '../../../testing';
import { FreehandShape } from './type';
import { createFreehandElement } from './utils';
import { withFreehandCreate } from './with-freehand-create';
import { withFreehandErase } from './with-freehand-erase';

const createMiddleButtonEvent = (type: string) =>
  createPointerEvent(type, 10, 10, undefined, undefined, {
    button: POINTER_BUTTON.WHEEL,
    view: null,
  });

describe('freehand pointer buttons', () => {
  let fixture: DrawnixTestingBoardFixture | undefined;

  afterEach(() => {
    fixture?.destroy();
    fixture = undefined;
  });

  it('delegates middle-button events without creating a freehand element', () => {
    const observer = createBoardEventObserver(['pointerDown', 'pointerMove', 'pointerUp']);
    fixture = setupDrawnixTestingBoard([observer.plugin, withFreehandCreate], [], {
      pointer: FreehandShape.feltTipPen,
      creationMode: BoardCreationMode.drawing,
    });
    const pointerDown = createMiddleButtonEvent('pointerdown');
    const pointerMove = createMiddleButtonEvent('pointermove');
    const pointerUp = createMiddleButtonEvent('pointerup');

    fixture.board.pointerDown(pointerDown);
    fixture.board.pointerMove(pointerMove);
    fixture.board.pointerUp(pointerUp);

    expect(observer.calls.pointerDown).toEqual([pointerDown]);
    expect(observer.calls.pointerMove).toEqual([pointerMove]);
    expect(observer.calls.pointerUp).toEqual([pointerUp]);
    expect(fixture.board.children).toEqual([]);
  });

  it('delegates middle-button events without removing a freehand element', () => {
    const observer = createBoardEventObserver(['pointerDown', 'pointerMove', 'pointerUp']);
    const freehand = createFreehandElement(FreehandShape.feltTipPen, [
      [0, 0],
      [20, 20],
    ]);
    fixture = setupDrawnixTestingBoard([observer.plugin, withFreehandErase], [freehand], {
      pointer: FreehandShape.eraser,
      creationMode: BoardCreationMode.drawing,
    });
    const pointerDown = createMiddleButtonEvent('pointerdown');
    const pointerMove = createMiddleButtonEvent('pointermove');
    const pointerUp = createMiddleButtonEvent('pointerup');

    fixture.board.pointerDown(pointerDown);
    fixture.board.pointerMove(pointerMove);
    fixture.board.pointerUp(pointerUp);

    expect(observer.calls.pointerDown).toEqual([pointerDown]);
    expect(observer.calls.pointerMove).toEqual([pointerMove]);
    expect(observer.calls.pointerUp).toEqual([pointerUp]);
    expect(fixture.board.children).toEqual([freehand]);
  });
});
