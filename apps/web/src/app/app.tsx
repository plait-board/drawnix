import { useState, useEffect } from 'react';
import { Drawnix, DrawnixToolState } from '@drawnix/drawnix';
import { PlaitElement, PlaitTheme, Viewport } from '@plait/core';
import localforage from 'localforage';

type AppValue = {
  children: PlaitElement[];
  viewport?: Viewport;
  theme?: PlaitTheme;
};

const MAIN_BOARD_CONTENT_KEY = 'main_board_content';
const MAIN_BOARD_TOOL_STATE_KEY = 'main_board_tool_state';

localforage.config({
  name: 'Drawnix',
  storeName: 'drawnix_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

export function App() {
  const [value, setValue] = useState<AppValue>({ children: [] });
  const [initialToolState, setInitialToolState] = useState<Partial<DrawnixToolState>>();
  const [loaded, setLoaded] = useState(false);

  const [tutorial, setTutorial] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [storedData, storedToolState] = await Promise.all([
        localforage.getItem(MAIN_BOARD_CONTENT_KEY),
        localforage.getItem(MAIN_BOARD_TOOL_STATE_KEY),
      ]);
      if (storedData) {
        const appValue = storedData as AppValue;
        setValue(appValue);
        if (appValue.children && appValue.children.length === 0) {
          setTutorial(true);
        }
      } else {
        setTutorial(true);
      }
      if (storedToolState) {
        setInitialToolState(storedToolState as Partial<DrawnixToolState>);
      }
      setLoaded(true);
    };
    loadData();
  }, []);
  if (!loaded) {
    return null;
  }
  return (
    <Drawnix
      value={value.children}
      viewport={value.viewport}
      theme={value.theme}
      initialToolState={initialToolState}
      onChange={(value) => {
        const newValue = value as AppValue;
        localforage.setItem(MAIN_BOARD_CONTENT_KEY, newValue);
        setValue(newValue);
        if (newValue.children && newValue.children.length > 0) {
          setTutorial(false);
        }
      }}
      onToolStateChange={(toolState) => {
        localforage.setItem(MAIN_BOARD_TOOL_STATE_KEY, toolState);
      }}
      tutorial={tutorial}
      afterInit={(_board) => {
        console.log('board initialized');
      }}
    ></Drawnix>
  );
}

export default App;
