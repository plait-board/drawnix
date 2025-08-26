import { useState, useEffect } from 'react';
import { initializeData } from './initialize-data';
import { Drawnix } from '@drawnix/drawnix';
import {
  PlaitBoard,
  PlaitElement,
  PlaitTheme,
  Viewport,
  ThemeColorMode,
  BoardTransforms,
} from '@plait/core';
import { BoardChangeData } from '@plait-board/react-board';
import localforage from 'localforage';
import { loadThemeFromStorage, saveThemeToStorage } from '@drawnix/drawnix';

// 1个月后移出删除兼容
const OLD_DRAWNIX_LOCAL_DATA_KEY = 'drawnix-local-data';
const MAIN_BOARD_CONTENT_KEY = 'main_board_content';

localforage.config({
  name: 'Drawnix',
  storeName: 'drawnix_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

export function App() {
  const [value, setValue] = useState<{
    children: PlaitElement[];
    viewport?: Viewport;
    theme?: PlaitTheme;
  }>({ children: [] });

  useEffect(() => {
    const loadData = async () => {
      // Load saved theme from localStorage
      const savedTheme = loadThemeFromStorage();

      const storedData = await localforage.getItem(MAIN_BOARD_CONTENT_KEY);
      if (storedData) {
        const data = storedData as any;
        // Always use theme from localStorage, not from stored data
        setValue({
          children: data.children,
          viewport: data.viewport,
          theme: { themeColorMode: savedTheme || ThemeColorMode.default },
        });
        return;
      }
      const localData = localStorage.getItem(OLD_DRAWNIX_LOCAL_DATA_KEY);
      if (localData) {
        const parsedData = JSON.parse(localData);
        // Use theme from localStorage, not from old data
        setValue({
          children: parsedData.children,
          viewport: parsedData.viewport,
          theme: { themeColorMode: savedTheme || ThemeColorMode.default },
        });
        // Save only children and viewport to new storage
        await localforage.setItem(MAIN_BOARD_CONTENT_KEY, {
          children: parsedData.children,
          viewport: parsedData.viewport,
        });
        localStorage.removeItem(OLD_DRAWNIX_LOCAL_DATA_KEY);
        return;
      }
      // For new users, use saved theme or default
      setValue({
        children: initializeData,
        theme: { themeColorMode: savedTheme || ThemeColorMode.default },
      });
    };

    loadData();
  }, []);
  return (
    <Drawnix
      value={value.children}
      viewport={value.viewport}
      theme={value.theme}
      //@ts-ignore
      onChange={(boardData: BoardChangeData) => {
        // Save theme to localStorage when it changes
        if (boardData.theme?.themeColorMode) {
          saveThemeToStorage(boardData.theme.themeColorMode);
        }

        // Don't save theme to localforage - only save content and viewport
        const newValue = {
          children: boardData.children,
          viewport: boardData.viewport,
          theme: boardData.theme, // Keep for state but don't persist
        };
        setValue(newValue);

        // Only save children and viewport to localforage, not theme
        localforage.setItem(MAIN_BOARD_CONTENT_KEY, {
          children: boardData.children,
          viewport: boardData.viewport,
        });
      }}
      afterInit={(board) => {
        console.log('board initialized');

        // Ensure the saved theme is applied after board initialization
        const savedTheme = loadThemeFromStorage();
        if (savedTheme && board.theme.themeColorMode !== savedTheme) {
          console.log('Applying saved theme after board init:', savedTheme);
          BoardTransforms.updateThemeColor(board, savedTheme);
        }

        console.log(
          `add __drawnix__web__debug_log to window, so you can call add log anywhere, like: window.__drawnix__web__console('some thing')`
        );
        (window as any)['__drawnix__web__console'] = (value: string) => {
          addDebugLog(board, value);
        };
      }}
    ></Drawnix>
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
