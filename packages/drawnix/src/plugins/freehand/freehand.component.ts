import {
  PlaitBoard,
  PlaitPluginElementContext,
  OnContextChanged,
  RectangleClient,
  isSelectionMoving,
  ACTIVE_STROKE_WIDTH,
} from '@plait/core';
import { ActiveGenerator, CommonElementFlavour, hasResizeHandle } from '@plait/common';
import { Freehand } from './type';
import { FreehandGenerator } from './freehand.generator';

export class FreehandComponent
  extends CommonElementFlavour<Freehand, PlaitBoard>
  implements OnContextChanged<Freehand, PlaitBoard>
{
  constructor() {
    super();
  }

  activeGenerator!: ActiveGenerator<Freehand>;

  generator!: FreehandGenerator;

  initializeGenerator() {
    this.activeGenerator = new ActiveGenerator<Freehand>(this.board, {
      getRectangle: (element: Freehand) => {
        return RectangleClient.getRectangleByPoints(element.points);
      },
      getStrokeWidth: () => ACTIVE_STROKE_WIDTH,
      getStrokeOpacity: () => 1,
      hasResizeHandle: () => {
        return hasResizeHandle(this.board, this.element);
      },
    });
    this.generator = new FreehandGenerator(this.board);
  }

  initialize(): void {
    super.initialize();
    this.initializeGenerator();
    this.generator.processDrawing(this.element, this.getElementG());
  }

  onContextChanged(
    value: PlaitPluginElementContext<Freehand, PlaitBoard>,
    previous: PlaitPluginElementContext<Freehand, PlaitBoard>
  ) {
    if (value.element !== previous.element || value.hasThemeChanged) {
      this.generator.processDrawing(this.element, this.getElementG());
      this.activeGenerator.processDrawing(
        this.element,
        PlaitBoard.getElementActiveHost(this.board),
        {
          selected: this.selected,
        }
      );
    } else {
      const needUpdate = value.selected !== previous.selected;
      if (needUpdate) {
        this.activeGenerator.processDrawing(
          this.element,
          PlaitBoard.getElementActiveHost(this.board),
          {
            selected: this.selected,
          }
        );
      }
    }
  }

  destroy(): void {
    super.destroy();
    this.activeGenerator?.destroy();
  }
}
