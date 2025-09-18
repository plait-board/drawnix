import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Drawnix, DrawnixSyncInfo } from '@drawnix/drawnix';
import { PlaitElement, PlaitTheme, Viewport } from '@plait/core';
import localforage from 'localforage';
import { SyncDialog } from './components/sync-dialog';
import {
  SyncGatewayClient,
  BoardState,
  ServerFileSummary,
  SyncStatus,
  WebDavSettings,
  UpdateWebDavSettingsInput,
} from './sync-gateway';

type AppValue = {
  children: PlaitElement[];
  viewport?: Viewport;
  theme?: PlaitTheme;
  updatedAt: number;
};

type SyncSession = {
  token: string;
};

type SyncState = {
  status: SyncStatus;
  authenticated: boolean;
  configured: boolean;
  token: string | null;
  lastSyncedAt?: number;
  error?: string;
  label?: string;
};

const MAIN_BOARD_CONTENT_KEY = 'main_board_content';
const SYNC_SESSION_KEY = 'main_board_sync_session';
const DEFAULT_POLL_INTERVAL = Math.max(
  parseInt((import.meta.env.VITE_SYNC_POLL_MS as string) || '5000', 10) || 5000,
  1000
);

localforage.config({
  name: 'Drawnix',
  storeName: 'drawnix_store',
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

const client = new SyncGatewayClient('/api');

export function App() {
  const [value, setValue] = useState<AppValue>({
    children: [],
    updatedAt: Date.now(),
  });
  const [tutorial, setTutorial] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'idle',
    authenticated: false,
    configured: false,
    token: null,
    error: undefined,
    lastSyncedAt: undefined,
    label: undefined,
  });
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [serverFiles, setServerFiles] = useState<ServerFileSummary[]>([]);
  const [webDavSettings, setWebDavSettings] = useState<WebDavSettings | null>(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  const pollInterval = DEFAULT_POLL_INTERVAL;

  const tokenRef = useRef<string | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const uploadTimerRef = useRef<number | null>(null);
  const lastRemoteTimestampRef = useRef<number>(0);
  const isApplyingRemote = useRef(false);
  const valueRef = useRef<AppValue>(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const applyBoardValue = useCallback(
    (nextValue: AppValue, options?: { remote?: boolean; resetTutorial?: boolean }) => {
      const remote = options?.remote ?? false;
      const resetTutorial = options?.resetTutorial ?? false;
      if (remote) {
        isApplyingRemote.current = true;
      }
      setValue(nextValue);
      localforage.setItem(MAIN_BOARD_CONTENT_KEY, nextValue);
      if (nextValue.children && nextValue.children.length > 0) {
        setTutorial(false);
      } else if (remote || resetTutorial) {
        setTutorial(true);
      }
      if (remote) {
        window.setTimeout(() => {
          isApplyingRemote.current = false;
        }, 0);
      }
    },
    []
  );

  const loadLocalBoard = useCallback(async () => {
    const storedData = (await localforage.getItem(
      MAIN_BOARD_CONTENT_KEY
    )) as AppValue | null;
    if (storedData && Array.isArray(storedData.children)) {
      const nextValue: AppValue = {
        children: storedData.children,
        viewport: storedData.viewport,
        theme: storedData.theme,
        updatedAt:
          typeof storedData.updatedAt === 'number'
            ? storedData.updatedAt
            : Date.now(),
      };
      applyBoardValue(nextValue, { resetTutorial: true });
    } else {
      setTutorial(true);
    }
  }, [applyBoardValue]);

  useEffect(() => {
    loadLocalBoard();
  }, [loadLocalBoard]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
      if (uploadTimerRef.current) {
        window.clearTimeout(uploadTimerRef.current);
        uploadTimerRef.current = null;
      }
    };
  }, [stopPolling]);

  const pollRemoteBoard = useCallback(async () => {
    if (!syncState.authenticated || !tokenRef.current) {
      return;
    }
    try {
      const board = await client.loadBoard(tokenRef.current);
      if (!board || typeof board.updatedAt !== 'number') {
        return;
      }
      const lastRemote = lastRemoteTimestampRef.current;
      if (board.updatedAt > lastRemote && board.updatedAt > valueRef.current.updatedAt) {
        applyBoardValue(toAppValue(board), { remote: true, resetTutorial: true });
        lastRemoteTimestampRef.current = board.updatedAt;
        setSyncState((prev) => ({
          ...prev,
          lastSyncedAt: board.updatedAt,
          status: 'connected',
          error: undefined,
        }));
      }
    } catch (error) {
      console.error('Polling failed', error);
      setSyncState((prev) => ({
        ...prev,
        status: 'disconnected',
        error: 'connection-error',
      }));
    }
  }, [applyBoardValue, syncState.authenticated]);

  const schedulePolling = useCallback(() => {
    stopPolling();
    if (!syncState.authenticated) {
      return;
    }
    pollTimerRef.current = window.setInterval(() => {
      pollRemoteBoard();
    }, pollInterval);
  }, [pollInterval, pollRemoteBoard, stopPolling, syncState.authenticated]);

  const startSync = useCallback(async () => {
    if (!tokenRef.current) {
      return;
    }
    setSyncState((prev) => ({
      ...prev,
      status: 'connecting',
      error: undefined,
    }));
    try {
      const board = await client.loadBoard(tokenRef.current);
      if (board && typeof board.updatedAt === 'number') {
        if (board.updatedAt > valueRef.current.updatedAt) {
          applyBoardValue(toAppValue(board), { remote: true, resetTutorial: true });
        }
        lastRemoteTimestampRef.current = board.updatedAt;
        setSyncState((prev) => ({
          ...prev,
          lastSyncedAt: board.updatedAt,
        }));
      }
      setSyncState((prev) => ({
        ...prev,
        status: 'connected',
        error: undefined,
      }));
      schedulePolling();
      await pollRemoteBoard();
    } catch (error) {
      console.error('Initial sync failed', error);
      setSyncState((prev) => ({
        ...prev,
        status: 'error',
        error: 'connection-error',
      }));
    }
  }, [applyBoardValue, pollRemoteBoard, schedulePolling]);

  const stopSync = useCallback(
    async (resetAuth: boolean) => {
      stopPolling();
      if (uploadTimerRef.current) {
        window.clearTimeout(uploadTimerRef.current);
        uploadTimerRef.current = null;
      }
      if (resetAuth) {
        tokenRef.current = null;
        await localforage.removeItem(SYNC_SESSION_KEY);
        setSyncState((prev) => ({
          status: 'idle',
          authenticated: false,
          configured: prev.configured,
          token: null,
          lastSyncedAt: prev.lastSyncedAt,
          error: undefined,
          label: prev.label,
        }));
      }
    },
    [stopPolling]
  );

  const loadSettings = useCallback(async (token: string) => {
    try {
      const settings = await client.getSettings(token);
      setWebDavSettings(settings);
      setSyncState((prev) => ({
        ...prev,
        label: settings.label || prev.label,
      }));
      return settings;
    } catch (error) {
      console.error('Failed to load settings', error);
      return null;
    }
  }, []);

  const refreshConfig = useCallback(async () => {
    try {
      const config = await client.getConfig();
      setSyncState((prev) => ({
        ...prev,
        configured: config.configured,
        label: config.label || prev.label,
      }));
      if (!config.configured) {
        await stopSync(true);
      }
      return config;
    } catch (error) {
      console.error('Failed to load sync config', error);
      setSyncState((prev) => ({
        ...prev,
        configured: false,
        label: prev.label,
      }));
      return { configured: false };
    }
  }, [stopSync]);

  useEffect(() => {
    const init = async () => {
      const config = await refreshConfig();
      if (!config.configured) {
        return;
      }
      const stored = (await localforage.getItem(
        SYNC_SESSION_KEY
      )) as SyncSession | null;
      if (!stored?.token) {
        return;
      }
      try {
        await client.validateToken(stored.token);
        tokenRef.current = stored.token;
        setSyncState((prev) => ({
          ...prev,
          authenticated: true,
          token: stored.token,
          status: 'connecting',
          label: config.label || prev.label,
        }));
        await loadSettings(stored.token);
        await startSync();
      } catch (error) {
        console.warn('Stored token invalid', error);
        await localforage.removeItem(SYNC_SESSION_KEY);
        tokenRef.current = null;
        setSyncState((prev) => ({
          ...prev,
          authenticated: false,
          token: null,
          status: 'idle',
        }));
      }
    };
    init();
  }, [refreshConfig, startSync, loadSettings]);

  const handleChange = useCallback(
    (next: any) => {
      const newValue: AppValue = {
        ...(next as AppValue),
        updatedAt: Date.now(),
      };
      applyBoardValue(newValue);
      if (
        !isApplyingRemote.current &&
        syncState.authenticated &&
        tokenRef.current
      ) {
        if (uploadTimerRef.current) {
          window.clearTimeout(uploadTimerRef.current);
          uploadTimerRef.current = null;
        }
        uploadTimerRef.current = window.setTimeout(async () => {
          const boardPayload = toBoardState(valueRef.current);
          try {
            await client.saveBoard(tokenRef.current as string, boardPayload);
            lastRemoteTimestampRef.current = boardPayload.updatedAt;
            setSyncState((prev) => ({
              ...prev,
              status: 'connected',
              lastSyncedAt: boardPayload.updatedAt,
              error: undefined,
            }));
          } catch (error) {
            console.error('Failed to upload board', error);
            setSyncState((prev) => ({
              ...prev,
              status: 'disconnected',
              error: 'upload-error',
            }));
          }
        }, 500);
      }
    },
    [applyBoardValue, syncState.authenticated]
  );

  const refreshFiles = useCallback(async () => {
    if (!syncState.authenticated || !tokenRef.current) {
      setServerFiles([]);
      return;
    }
    setIsLoadingFiles(true);
    try {
      const files = await client.listFiles(tokenRef.current);
      setServerFiles(files);
      setSyncState((prev) => ({
        ...prev,
        error: undefined,
      }));
    } catch (error) {
      console.error('Failed to list files', error);
      setSyncState((prev) => ({
        ...prev,
        error: 'list-error',
      }));
    } finally {
      setIsLoadingFiles(false);
    }
  }, [syncState.authenticated]);

  useEffect(() => {
    if (syncDialogOpen && syncState.authenticated) {
      refreshFiles();
    }
  }, [refreshFiles, syncDialogOpen, syncState.authenticated]);

  const handleVerifyCredentials = useCallback(
    async (password: string) => {
      setIsVerifying(true);
      try {
        const result = await client.verifyPassword(password);
        tokenRef.current = result.token;
        await localforage.setItem(SYNC_SESSION_KEY, { token: result.token });
        setSyncState((prev) => ({
          ...prev,
          authenticated: true,
          token: result.token,
          status: 'connecting',
          configured: true,
          label: result.label || prev.label,
          error: undefined,
        }));
        await loadSettings(result.token);
        await startSync();
      } finally {
        setIsVerifying(false);
      }
    },
    [loadSettings, startSync]
  );

  const handleSignOut = useCallback(async () => {
    await stopSync(true);
    setServerFiles([]);
  }, [stopSync]);

  const handleSaveFile = useCallback(
    async (name: string) => {
      if (!syncState.authenticated || !tokenRef.current) {
        throw new Error('Not authenticated');
      }
      const trimmed = name.trim();
      if (!trimmed) {
        throw new Error('File name is required');
      }
      try {
        const payload = buildFileContent(valueRef.current);
        const saved = await client.uploadFile(tokenRef.current, trimmed, payload);
        setServerFiles((prev) => {
          const filtered = prev.filter((file) => file.name !== saved.name);
          return [saved, ...filtered];
        });
        setSyncState((prev) => ({
          ...prev,
          lastSyncedAt: saved.updatedAt,
          error: undefined,
        }));
      } catch (error) {
        setSyncState((prev) => ({
          ...prev,
          error: 'upload-error',
        }));
        throw error instanceof Error ? error : new Error('upload-error');
      }
    },
    [syncState.authenticated]
  );

  const handleLoadFile = useCallback(
    async (name: string) => {
      if (!syncState.authenticated || !tokenRef.current) {
        throw new Error('Not authenticated');
      }
      const text = await client.downloadFile(tokenRef.current, name);
      try {
        if (!text) {
          throw new Error('DOWNLOAD_ERROR');
        }
        let parsed: any;
        try {
          parsed = JSON.parse(text);
        } catch (error) {
          throw new Error('DOWNLOAD_ERROR');
        }
        if (!parsed || !Array.isArray(parsed.elements)) {
          throw new Error('DOWNLOAD_ERROR');
        }
        const nextValue: AppValue = {
          children: parsed.elements,
          viewport: parsed.viewport || undefined,
          theme: parsed.theme || undefined,
          updatedAt:
            typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
        };
        applyBoardValue(nextValue, { remote: true, resetTutorial: true });
        setSyncState((prev) => ({
          ...prev,
          lastSyncedAt: Date.now(),
          error: undefined,
        }));
        lastRemoteTimestampRef.current = nextValue.updatedAt;
      } catch (error) {
        setSyncState((prev) => ({
          ...prev,
          error: 'download-error',
        }));
        throw error instanceof Error ? error : new Error('download-error');
      }
    },
    [applyBoardValue, syncState.authenticated]
  );

  const handleRenameFile = useCallback(
    async (oldName: string, newName: string) => {
      if (!syncState.authenticated || !tokenRef.current) {
        throw new Error('Not authenticated');
      }
      const renamed = await client.renameFile(tokenRef.current, oldName, newName);
      setServerFiles((prev) => {
        const filtered = prev.filter((file) => file.name !== oldName);
        return [...filtered, renamed].sort((a, b) => b.updatedAt - a.updatedAt);
      });
      setSyncState((prev) => ({
        ...prev,
        lastSyncedAt: renamed.updatedAt,
        error: undefined,
      }));
    },
    [syncState.authenticated]
  );

  const handleDeleteFile = useCallback(
    async (name: string) => {
      if (!syncState.authenticated || !tokenRef.current) {
        throw new Error('Not authenticated');
      }
      await client.deleteFile(tokenRef.current, name);
      setServerFiles((prev) => prev.filter((file) => file.name !== name));
      setSyncState((prev) => ({
        ...prev,
        error: undefined,
      }));
    },
    [syncState.authenticated]
  );

  const handleUpdateSettings = useCallback(
    async (input: UpdateWebDavSettingsInput) => {
      if (!syncState.authenticated || !tokenRef.current) {
        throw new Error('Not authenticated');
      }
      setIsUpdatingSettings(true);
      try {
        const updated = await client.updateSettings(tokenRef.current, input);
        setWebDavSettings(updated);
        setSyncState((prev) => ({
          ...prev,
          configured: true,
          label: updated.label || prev.label,
          error: undefined,
        }));
        await refreshConfig();
        await stopSync(false);
        await startSync();
        await refreshFiles();
        return updated;
      } catch (error) {
        console.error('Failed to update settings', error);
        throw error instanceof Error ? error : new Error('SETTINGS_ERROR');
      } finally {
        setIsUpdatingSettings(false);
      }
    },
    [refreshConfig, refreshFiles, startSync, stopSync, syncState.authenticated]
  );

  const syncInfo: DrawnixSyncInfo = useMemo(
    () => ({
      status: syncState.status,
      lastSyncedAt: syncState.lastSyncedAt,
      error: syncState.error,
      onOpenSettings: () => setSyncDialogOpen(true),
    }),
    [syncState]
  );

  const connectionLabel = syncState.authenticated ? syncState.label || '' : '';
  const defaultFileName = useMemo(
    () => formatSuggestedFileName(value.updatedAt),
    [value.updatedAt]
  );

  return (
    <Drawnix
      value={value.children}
      viewport={value.viewport}
      theme={value.theme}
      onChange={handleChange}
      tutorial={tutorial}
      syncInfo={syncInfo}
      renderSyncDialog={(container) => (
        <SyncDialog
          container={container}
          open={syncDialogOpen}
          onOpenChange={setSyncDialogOpen}
          status={syncState.status}
          connectionLabel={connectionLabel}
          lastSyncedAt={syncState.lastSyncedAt}
          error={syncState.error}
          isVerifying={isVerifying}
          onVerify={handleVerifyCredentials}
          onSignOut={handleSignOut}
          hasSession={syncState.authenticated}
          isConfigured={syncState.configured}
          files={serverFiles}
          isLoadingFiles={isLoadingFiles}
          onRefreshFiles={refreshFiles}
          onSaveFile={handleSaveFile}
          onLoadFile={handleLoadFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          settings={webDavSettings}
          onUpdateSettings={handleUpdateSettings}
          isUpdatingSettings={isUpdatingSettings}
          defaultFileName={defaultFileName}
        />
      )}
      afterInit={() => {
        console.log('board initialized');
      }}
    ></Drawnix>
  );
}

export default App;

function toAppValue(board: BoardState): AppValue {
  return {
    children: board.children || [],
    viewport: board.viewport || undefined,
    theme: board.theme || undefined,
    updatedAt: board.updatedAt || Date.now(),
  };
}

function toBoardState(value: AppValue): BoardState {
  return {
    children: value.children,
    viewport: value.viewport || null,
    theme: value.theme || null,
    updatedAt: value.updatedAt,
  };
}

function buildFileContent(value: AppValue) {
  return JSON.stringify(
    {
      type: 'drawnix',
      version: 1,
      source: 'web',
      elements: value.children,
      viewport: value.viewport,
      theme: value.theme,
      updatedAt: value.updatedAt,
    },
    null,
    2
  );
}

function formatSuggestedFileName(timestamp: number) {
  const date = new Date(timestamp || Date.now());
  return `board-${date.toISOString().replace(/[:.]/g, '-')}`;
}
