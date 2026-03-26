export const DEFAULT_FREEHAND_STROKE_WIDTH = 1;

export const FREEHAND_STROKE_WIDTH_PRESETS = [1, 2, 4, 8];

export type FreehandDrawOptions = {
  strokeColor?: string;
  strokeWidth?: number;
};

export const resolveFreehandDrawOptions = (
  drawOptions: FreehandDrawOptions = {}
) => {
  const normalizedDrawOptions: FreehandDrawOptions = {};
  if (drawOptions.strokeColor && drawOptions.strokeColor !== 'NO_COLOR') {
    normalizedDrawOptions.strokeColor = drawOptions.strokeColor;
  }
  if (
    drawOptions.strokeWidth &&
    drawOptions.strokeWidth !== DEFAULT_FREEHAND_STROKE_WIDTH
  ) {
    normalizedDrawOptions.strokeWidth = drawOptions.strokeWidth;
  }
  return normalizedDrawOptions;
};
