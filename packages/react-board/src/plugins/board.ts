import type { RenderComponentRef } from '@plait/common';
import {
  PlaitElement,
  PlaitOperation,
  Viewport,
  Selection,
  type PlaitTheme
} from '@plait/core';

export interface ReactBoard {
  renderComponent: <T extends object>(
    children: React.ReactNode,
    container: Element | DocumentFragment,
    props: T
  ) => RenderComponentRef<T>;
}

export interface BoardChangeData {
  children: PlaitElement[];
  operations: PlaitOperation[];
  viewport: Viewport;
  selection: Selection | null;
  theme: PlaitTheme;
}
