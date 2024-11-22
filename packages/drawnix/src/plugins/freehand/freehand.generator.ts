import { Generator } from '@plait/common';
import { PlaitBoard, setStrokeLinecap } from '@plait/core';
import { Options } from 'roughjs/bin/core';
import { DefaultFreehand, Freehand } from './type';

export interface FreehandData {}

export class FreehandGenerator extends Generator<Freehand, FreehandData> {
  protected draw(
    element: Freehand,
    data?: FreehandData | undefined
  ): SVGGElement | undefined {
    let option: Options = { ...DefaultFreehand };
    const g = PlaitBoard.getRoughSVG(this.board).curve(element.points, option);
    setStrokeLinecap(g, 'round');
    return g;
  }

  canDraw(element: Freehand, data: FreehandData): boolean {
    return true;
  }
}
