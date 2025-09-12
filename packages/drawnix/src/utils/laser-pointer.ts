import { PlaitBoard } from '@plait/core';
import {
  drainPoints,
  drawLaserPen,
  IOriginalPointData,
  setColor,
  setDelay,
  setMaxWidth,
  setMinWidth,
  setOpacity,
  setRoundCap,
} from 'laser-pen';

export const LASER_POINTER_CLASS_NAME = 'laser-pointer';

const calculateRatio = (context: any): number => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};

export class LaserPointer {
  private mouseTrack: IOriginalPointData[] = [];
  private mouseMoveHandler: ((event: MouseEvent) => void) | null = null;
  private resizeHandler: (() => void) | null = null;
  private cvsDom: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private canvasPos: DOMRect | null = null;
  private drawing = false;
  private container: HTMLElement | null = null;

  public init(board: PlaitBoard): void {
    this.container = PlaitBoard.getBoardContainer(board).closest(
      '.drawnix'
    ) as HTMLElement;
    this.cvsDom = this.container.querySelector(
      `.${LASER_POINTER_CLASS_NAME}`
    ) as HTMLCanvasElement;
    this.ctx = this.cvsDom.getContext('2d') as CanvasRenderingContext2D;
    this.canvasPos = this.cvsDom.getBoundingClientRect();

    this.mouseMoveHandler = (event: MouseEvent) => {
      if (!this.canvasPos) return;
      const relativeX = event.clientX - this.canvasPos.x;
      const relativeY = event.clientY - this.canvasPos.y;
      this.mouseTrack.push({
        x: relativeX,
        y: relativeY,
        time: Date.now(),
      });
      this.ctx && this.startDraw();
    };

    this.resizeHandler = () => this.setCanvasSize();
    this.container.addEventListener('pointermove', this.mouseMoveHandler);
    window.addEventListener('resize', this.resizeHandler);

    this.setCanvasSize();
  }

  public destroy(): void {
    if (this.mouseMoveHandler && this.container) {
      this.container.removeEventListener('pointermove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.ctx && this.cvsDom) {
      this.ctx.clearRect(0, 0, this.cvsDom.width, this.cvsDom.height);
    }

    this.cvsDom = null;
    this.ctx = null;
    this.canvasPos = null;
    this.drawing = false;
  }

  private startDraw(): void {
    if (!this.drawing) {
      this.drawing = true;
      this.draw();
    }
  }

  private draw(): void {
    if (!this.ctx || !this.cvsDom) return;

    this.ctx.clearRect(0, 0, this.cvsDom.width, this.cvsDom.height);
    let needDrawInNextFrame = false;

    this.mouseTrack = drainPoints(this.mouseTrack);
    if (this.mouseTrack.length >= 3) {
      setColor(211, 211, 211);
      setDelay(180);
      setRoundCap(true);
      setMaxWidth(10);
      setMinWidth(0);
      setOpacity(0.6);
      drawLaserPen(this.ctx, this.mouseTrack);
      needDrawInNextFrame = true;
    } else {
      const centerPoint = this.mouseTrack[this.mouseTrack.length - 1];
      if (!centerPoint) return;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(211, 211, 211)`;
      this.ctx.arc(centerPoint.x, centerPoint.y, 5, 0, Math.PI * 2, false);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }

    if (needDrawInNextFrame) {
      requestAnimationFrame(() => this.draw());
    } else {
      this.drawing = false;
    }
  }

  private setCanvasSize(): void {
    if (!this.cvsDom || !this.ctx) return;

    const rect = this.cvsDom.getBoundingClientRect();
    const ratio = calculateRatio(this.ctx);

    this.cvsDom.setAttribute('width', `${rect.width * ratio}px`);
    this.cvsDom.setAttribute('height', `${rect.height * ratio}px`);
    this.ctx.scale(ratio, ratio);

    this.canvasPos = this.cvsDom.getBoundingClientRect();
  }
}
