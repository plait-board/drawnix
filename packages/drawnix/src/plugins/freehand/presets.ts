export const DEFAULT_FREEHAND_STROKE_WIDTH = 2;

export const MIN_FREEHAND_STROKE_WIDTH = 1;

export const MAX_FREEHAND_STROKE_WIDTH = 12;

export const FREEHAND_STROKE_WIDTH_STEP = 0.25;

export type FreehandDrawOptions = {
  strokeColor?: string;
  strokeWidth: number;
};

export const DEFAULT_FREEHAND_PRESETS: FreehandDrawOptions[] = [
  {
    strokeWidth: DEFAULT_FREEHAND_STROKE_WIDTH,
  },
  {
    strokeColor: '#FF4500',
    strokeWidth: 6,
  },
  {
    strokeColor: '#2ECC71',
    strokeWidth: 10,
  },
];

export const resolveFreehandDrawOptions = (
  drawOptions: Partial<FreehandDrawOptions> = {}
) => {
  const normalizedDrawOptions = {} as Partial<FreehandDrawOptions>;

  if (typeof drawOptions.strokeColor === 'string' && drawOptions.strokeColor) {
    normalizedDrawOptions.strokeColor = drawOptions.strokeColor;
  }

  if (typeof drawOptions.strokeWidth === 'number') {
    normalizedDrawOptions.strokeWidth = drawOptions.strokeWidth;
  }

  return normalizedDrawOptions;
};
