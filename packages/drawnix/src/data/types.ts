import { PlaitElement, Viewport } from '@plait/core';

export interface DrawnixExportedData {
  type: DrawnixExportedType.drawnix;
  version: number;
  source: 'web';
  elements: PlaitElement[];
  viewport: Viewport;
}

export enum DrawnixExportedType {
    drawnix = 'drawnix'
}