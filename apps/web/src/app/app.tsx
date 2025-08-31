import { useState, useEffect, useRef, useCallback } from 'react';
import { initializeData } from './initialize-data';
import { Drawnix } from '@drawnix/drawnix';
import { PlaitBoard, PlaitElement, PlaitTheme, Viewport } from '@plait/core';
import localforage from 'localforage';

// 1个月后移出删除兼容
const OLD_DRAWNIX_LOCAL_DATA_KEY = 'drawnix-local-data';
const MAIN_BOARD_CONTENT_KEY = 'main_board_content';

localforage.config({
  name: 'Drawnix',
  storeName: 'drawnix_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});
const useDebugLogger = () => {
  const boardRef = useRef<PlaitBoard | null>(null);
  
  const setBoard = useCallback((board: PlaitBoard) => {
    boardRef.current = board;
  }, []);
  
  const logDebug = useCallback((value: string) => {
    if (!boardRef.current) return;
    
    const board = boardRef.current;
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
    div.textContent = value;
    consoleContainer.append(div);
  }, []);
  
  return { setBoard, logDebug };
};

export function App() {
  const [value, setValue] = useState<{
    children: PlaitElement[];
    viewport?: Viewport;
    theme?: PlaitTheme;
  }>({ children: [] });
  const debugLogger = useDebugLogger();

  useEffect(() => {
    const loadData = async () => {
      const storedData = await localforage.getItem(MAIN_BOARD_CONTENT_KEY);
      if (storedData) {
        setValue(storedData as any);
        return;
      }
      const localData = localStorage.getItem(OLD_DRAWNIX_LOCAL_DATA_KEY);
      if (localData) {
        const parsedData = JSON.parse(localData);
        setValue(parsedData);
        await localforage.setItem(MAIN_BOARD_CONTENT_KEY, parsedData);
        localStorage.removeItem(OLD_DRAWNIX_LOCAL_DATA_KEY);
        return;
      }
      setValue({ children: initializeData });
    };

    loadData();
  }, []);
  
  return (
    <Drawnix
      value={value.children}
      viewport={value.viewport}
      theme={value.theme}
      onChange={(value) => {
        localforage.setItem(MAIN_BOARD_CONTENT_KEY, value);
        setValue(value);
      }}
      afterInit={(board) => {
        console.log('board initialized');
        debugLogger.setBoard(board);
      }}
    ></Drawnix>
  );
}

export default App;
