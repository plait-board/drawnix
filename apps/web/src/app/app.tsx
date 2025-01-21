import { useState } from 'react';
import { initializeData } from './initialize-data';
import { Drawnix } from '@drawnix/core';
import { PlaitElement, PlaitTheme, Viewport } from '@plait/core';

const DRAWNIX_LOCAL_DATA_KEY = 'drawnix-local-data';

export function App() {
  const [value] = useState<{
    children: PlaitElement[];
    viewport?: Viewport;
    theme?: PlaitTheme;
  }>(() => {
    const localData = localStorage.getItem(DRAWNIX_LOCAL_DATA_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
    return { children: initializeData };
  });
  return (
    <Drawnix
      value={value.children}
      viewport={value.viewport}
      theme={value.theme}
      onChange={(value) => {
        localStorage.setItem(DRAWNIX_LOCAL_DATA_KEY, JSON.stringify(value));
      }}
      onSelectionChange={(value) => {}}
      onViewportChange={(value) => {}}
      onThemeChange={(value) => {}}
      onValueChange={(value) => {}}
    ></Drawnix>
  );
}

export default App;
