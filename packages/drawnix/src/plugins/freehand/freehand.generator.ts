import { Generator } from '@plait/common';
import { PlaitBoard, setStrokeLinecap } from '@plait/core';
import { Options } from 'roughjs/bin/core';
import { Freehand } from './type';
import {
  gaussianSmooth,
  getFillByElement,
  getStrokeColorByElement,
} from './utils';
import { getStrokeWidthByElement } from '@plait/draw';

export class FreehandGenerator extends Generator<Freehand> {
  protected draw(element: Freehand): SVGGElement | undefined {
    const strokeWidth = getStrokeWidthByElement(element);
    const strokeColor = getStrokeColorByElement(this.board, element);
    const fill = getFillByElement(this.board, element);
    const option: Options = { strokeWidth, stroke: strokeColor, fill, fillStyle: 'solid' };
    const g = PlaitBoard.getRoughSVG(this.board).curve(
      gaussianSmooth(element.points, 1, 3),
      option
    );
    setStrokeLinecap(g, 'round');
    return g;
  }

  canDraw(element: Freehand): boolean {
    return true;
  }
}
