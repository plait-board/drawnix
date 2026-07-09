import { useState, useEffect } from 'react';
import {
  Drawnix,
  DrawnixExportedData,
  DrawnixExportedType,
  DrawnixToolState,
  LinkIcon,
  OpenFileIcon,
  SaveFileIcon,
} from '@drawnix/drawnix';
import { PlaitElement, PlaitTheme, Viewport } from '@plait/core';
import localforage from 'localforage';
import {
  CloudDrawingSession,
  createCloudDrawing,
  getCloudDrawingIdFromLocation,
  loadCloudDrawing,
  updateCloudDrawing,
} from './cloud-storage';

type AppValue = {
  children: PlaitElement[];
  viewport?: Viewport;
  theme?: PlaitTheme;
};

type Language = 'zh' | 'en' | 'ru' | 'ar' | 'vi';

type MainBoardPreference = {
  language: Language;
  copyTransparent: boolean;
  exportTransparent: boolean;
};

const MAIN_BOARD_CONTENT_KEY = 'main_board_content';
const MAIN_BOARD_TOOL_STATE_KEY = 'main_board_tool_state';
const MAIN_BOARD_PREFERENCE_KEY = 'main_board_preference';
const MAIN_BOARD_CLOUD_SESSIONS_KEY = 'main_board_cloud_sessions';

localforage.config({
  name: 'Drawnix',
  storeName: 'drawnix_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

export function App() {
  const [value, setValue] = useState<AppValue>({ children: [] });
  const [initialToolState, setInitialToolState] = useState<Partial<DrawnixToolState>>();
  const [preference, setPreference] = useState<MainBoardPreference>({
    language: 'zh',
    copyTransparent: false,
    exportTransparent: false,
  });
  const [loaded, setLoaded] = useState(false);
  const [cloudSession, setCloudSession] = useState<CloudDrawingSession | null>(null);
  const [cloudSessions, setCloudSessions] = useState<Record<string, CloudDrawingSession>>({});
  const [cloudBusy, setCloudBusy] = useState(false);

  const [tutorial, setTutorial] = useState(false);

  const updatePreference = (partialPreference: Partial<MainBoardPreference>) => {
    setPreference((currentPreference) => {
      const nextPreference = { ...currentPreference, ...partialPreference };
      localforage.setItem(MAIN_BOARD_PREFERENCE_KEY, nextPreference);
      return nextPreference;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      const [storedData, storedToolState, storedPreference, storedCloudSessions] = await Promise.all([
        localforage.getItem(MAIN_BOARD_CONTENT_KEY),
        localforage.getItem(MAIN_BOARD_TOOL_STATE_KEY),
        localforage.getItem(MAIN_BOARD_PREFERENCE_KEY),
        localforage.getItem(MAIN_BOARD_CLOUD_SESSIONS_KEY),
      ]);
      const loadedCloudSessions =
        (storedCloudSessions as Record<string, CloudDrawingSession> | null) ?? {};
      setCloudSessions(loadedCloudSessions);

      const cloudDrawingId = getCloudDrawingIdFromLocation();
      if (cloudDrawingId) {
        try {
          const cloudData = await loadCloudDrawing(cloudDrawingId);
          const session = loadedCloudSessions[cloudDrawingId] ?? {
            id: cloudDrawingId,
            viewUrl: `${window.location.origin}/d/${cloudDrawingId}`,
          };
          setValue(importCloudDrawing(cloudData));
          setCloudSession(session);
          setTutorial(cloudData.elements.length === 0);
        } catch (error) {
          console.error(error);
          setTutorial(true);
        }
      } else if (storedData) {
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
      if (storedPreference) {
        setPreference(storedPreference as MainBoardPreference);
      }
      setLoaded(true);
    };
    loadData();
  }, []);
  if (!loaded) {
    return null;
  }

  const persistCloudSession = async (session: CloudDrawingSession) => {
    const nextCloudSessions = {
      ...cloudSessions,
      [session.id]: session,
    };
    setCloudSessions(nextCloudSessions);
    setCloudSession(session);
    await localforage.setItem(MAIN_BOARD_CLOUD_SESSIONS_KEY, nextCloudSessions);
  };

  const saveToCloud = async () => {
    setCloudBusy(true);
    try {
      const result = await createCloudDrawing(exportCloudDrawing(value));
      await persistCloudSession(result);
      window.history.replaceState(null, '', `/d/${result.id}`);
      await navigator.clipboard.writeText(result.viewUrl).catch(() => undefined);
    } catch (error) {
      window.alert(getErrorMessage(error));
    } finally {
      setCloudBusy(false);
    }
  };

  const updateCloud = async () => {
    if (!cloudSession?.editToken) {
      return;
    }
    setCloudBusy(true);
    try {
      const result = await updateCloudDrawing(cloudSession, exportCloudDrawing(value));
      await persistCloudSession({
        ...cloudSession,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      window.alert(getErrorMessage(error));
    } finally {
      setCloudBusy(false);
    }
  };

  const copyCloudLink = async () => {
    if (cloudSession) {
      await navigator.clipboard.writeText(cloudSession.viewUrl);
    }
  };

  return (
    <Drawnix
      value={value.children}
      viewport={value.viewport}
      theme={value.theme}
      initialToolState={initialToolState}
      initialLanguage={preference.language}
      initialPreference={{
        copyTransparent: preference.copyTransparent,
        exportTransparent: preference.exportTransparent,
      }}
      onLanguageChange={(language) => {
        updatePreference({ language });
      }}
      onPreferenceChange={({ copyTransparent, exportTransparent }) => {
        updatePreference({ copyTransparent, exportTransparent });
      }}
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
      appMenuItems={[
        {
          key: 'save-cloud',
          label: cloudBusy ? 'Saving to cloud...' : 'Save to Cloud',
          icon: SaveFileIcon,
          disabled: cloudBusy,
          onSelect: saveToCloud,
        },
        {
          key: 'update-cloud',
          label: cloudBusy ? 'Updating cloud...' : 'Update Cloud Copy',
          icon: SaveFileIcon,
          disabled: cloudBusy || !cloudSession?.editToken,
          onSelect: updateCloud,
        },
        {
          key: 'open-cloud',
          label: 'Open Cloud Link',
          icon: OpenFileIcon,
          onSelect: () => {
            const idOrUrl = window.prompt('Paste a Drawnix cloud link or drawing id');
            const id = parseCloudDrawingId(idOrUrl);
            if (id) {
              window.location.href = `/d/${id}`;
            }
          },
        },
        {
          key: 'copy-cloud-link',
          label: 'Copy Cloud Link',
          icon: LinkIcon,
          disabled: !cloudSession,
          onSelect: copyCloudLink,
        },
      ]}
    ></Drawnix>
  );
}

export default App;

const exportCloudDrawing = (value: AppValue): DrawnixExportedData => {
  return {
    type: DrawnixExportedType.drawnix,
    version: 1,
    source: 'web',
    elements: value.children,
    viewport: value.viewport ?? { zoom: 1 },
    theme: value.theme,
  };
};

const importCloudDrawing = (data: DrawnixExportedData): AppValue => {
  return {
    children: data.elements,
    viewport: data.viewport,
    theme: data.theme,
  };
};

export const parseCloudDrawingId = (value: string | null) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const pathMatch = url.pathname.match(/^\/d\/([^/]+)$/);
    return pathMatch?.[1] ?? url.searchParams.get('drawing');
  } catch {
    return value.trim() || null;
  }
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Cloud storage request failed.';
};
