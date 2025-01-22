import { useState } from 'react';
import { initializeData } from './initialize-data';
import { Drawnix } from '@drawnix/core';
import { PlaitBoard, PlaitElement, PlaitTheme, Viewport } from '@plait/core';

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
    <>
      <Drawnix
        value={value.children}
        viewport={value.viewport}
        theme={value.theme}
        onChange={(value) => {
          localStorage.setItem(DRAWNIX_LOCAL_DATA_KEY, JSON.stringify(value));
        }}
        afterInit={(board) => {
          console.log('board initialized');
          console.log(
            `add __drawnix__web__debug_log to window, so you can call add log anywhere, like: window.__drawnix__web__console('some thing')`
          );
          (window as any)['__drawnix__web__console'] = (value: string) => {
            addDebugLog(board, value);
          };
        }}
      ></Drawnix>
    </>
  );
}

const addDebugLog = (board: PlaitBoard, value: string) => {
  const container = PlaitBoard.getBoardContainer(board).closest(
    '.drawnix'
  ) as HTMLElement;
  let consoleContainer = container.querySelector('.drawnix-console');
  if (!consoleContainer) {
    consoleContainer = document.createElement('div');
    consoleContainer.classList.add('drawnix-console');
    container.append(consoleContainer);
  }
  const div = document.createElement('div');
  div.innerHTML = value;
  consoleContainer.append(div);
};

export default App;
