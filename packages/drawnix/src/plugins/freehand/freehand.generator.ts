import { Generator } from '@plait/common';
import { PlaitBoard, setStrokeLinecap } from '@plait/core';
import { Options } from 'roughjs/bin/core';
import { DefaultFreehand, Freehand } from './type';
import { gaussianSmooth } from './utils';

export interface FreehandData {}

export class FreehandGenerator extends Generator<Freehand, FreehandData> {
  protected draw(
    element: Freehand,
    data?: FreehandData | undefined
  ): SVGGElement | undefined {
    let option: Options = { ...DefaultFreehand };
    const g = PlaitBoard.getRoughSVG(this.board).curve(
      gaussianSmooth(element.points, 1, 9),
      option
    );
    setStrokeLinecap(g, 'round');
    return g;
  }

  canDraw(element: Freehand): boolean {
    return true;
  }
}
