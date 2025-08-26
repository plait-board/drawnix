import { PlaitElement, PlaitTheme, Viewport } from '@plait/core';

export interface DrawnixExportedData {
  type: DrawnixExportedType.drawnix;
  version: number;
  source: 'web';
  elements: PlaitElement[];
  viewport: Viewport;
  theme?: PlaitTheme;
}

export enum DrawnixExportedType {
  drawnix = 'drawnix',
}
