import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../dialog/dialog';
import { useDrawnix } from '../../hooks/use-drawnix';
import { listFiles, loadFile, deleteFile } from '../../data/webdav';
import type { WebDAVFile } from '../../data/webdav-types';
import { useI18n } from '../../i18n';
import { useBoard, useListRender } from '@plait-board/react-board';
import { BoardTransforms, PlaitBoard } from '@plait/core';
import { loadFromBlob } from '../../data/blob';
import { MIME_TYPES } from '../../constants';
import { normalizeFile } from '../../data/blob';

interface WebDAVFileBrowserProps {
  container: HTMLElement | null;
}

export const WebDAVFileBrowser = ({ container }: WebDAVFileBrowserProps) => {
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();
  const board = useBoard();
  const listRender = useListRender();

  const [files, setFiles] = useState<WebDAVFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearAndLoad = (
    value: any[],
    viewport?: any,
    theme?: any
  ) => {
    board.children = value;
    board.viewport = viewport || { zoom: 1 };
    if (theme) {
      board.theme = theme;
    }
    listRender.update(board.children, {
      board: board,
      parent: board,
      parentG: PlaitBoard.getElementHost(board),
    });
    BoardTransforms.fitViewport(board);
  };

  const loadFiles = async () => {
    if (!appState.webdavConfig) {
      setError(t('webdav not configured'));
      return;
    }

    setLoading(true);
    setError(null);

    const result = await listFiles(appState.webdavConfig.path);
    setLoading(false);

    if (result.success) {
      const drawnixFiles = result.files.filter((file) =>
        file.filename.endsWith('.drawnix')
      );
      setFiles(drawnixFiles);
    } else {
      setError(result.error || t('failed to load files'));
    }
  };

  useEffect(() => {
    if (appState.openWebDAVFileBrowser) {
      loadFiles();
    }
  }, [appState.openWebDAVFileBrowser]);

  const handleOpenFile = async (filename: string) => {
    setLoadingFile(filename);
    setError(null);

    const result = await loadFile(filename);
    setLoadingFile(null);

    if (result.success && result.data) {
      try {
        const blob = new Blob([result.data], { type: MIME_TYPES.drawnix });
        const file = await normalizeFile(
          new File([blob], filename, { type: MIME_TYPES.drawnix })
        );
        const data = await loadFromBlob(board, file);
        clearAndLoad(data.elements, data.viewport, data.theme);
        closeBrowser();
      } catch (error: any) {
        setError(error.message || t('failed to open file'));
      }
    } else {
      setError(result.error || t('failed to open file'));
    }
  };

  const handleDeleteFile = async (filename: string) => {
    if (!confirm(t('confirm delete file'))) {
      return;
    }

    const result = await deleteFile(filename);

    if (result.success) {
      setFiles(files.filter((file) => file.filename !== filename));
    } else {
      setError(result.error || t('failed to delete file'));
    }
  };

  const closeBrowser = () => {
    setFiles([]);
    setError(null);
    setAppState({
      ...appState,
      openWebDAVFileBrowser: false,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Dialog
      open={appState.openWebDAVFileBrowser}
      onOpenChange={closeBrowser}
    >
      <DialogContent
        className="Dialog webdav-file-browser"
        container={container}
      >
        <div className="webdav-file-browser-content">
          <div className="webdav-file-browser-header">
            <h2>{t('webdav files')}</h2>
            <button className="refresh-button" onClick={loadFiles}>
              {t('refresh')}
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {loading && <div className="loading">{t('loading')}</div>}

          {!loading && files.length === 0 && (
            <div className="no-files">
              {appState.webdavConfig
                ? t('no drawnix files')
                : t('webdav not configured')}
            </div>
          )}

          {!loading && files.length > 0 && (
            <div className="file-list">
              {files.map((file) => (
                <div
                  key={file.filename}
                  className={`file-item ${
                    loadingFile === file.filename ? 'loading' : ''
                  }`}
                >
                  <div className="file-info">
                    <div className="file-name">{file.filename}</div>
                    <div className="file-meta">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{formatDate(file.lastmodified)}</span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <button
                      className="open-button"
                      onClick={() => handleOpenFile(file.filename)}
                      disabled={!!loadingFile}
                    >
                      {t('open')}
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteFile(file.filename)}
                      disabled={!!loadingFile}
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="close-button" onClick={closeBrowser}>
            {t('close')}
          </button>
        </div>

        <style>{`
          .webdav-file-browser-content {
            padding: 20px;
            min-width: 500px;
          }
          .webdav-file-browser-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .webdav-file-browser-header h2 {
            margin: 0;
            font-size: 18px;
          }
          .refresh-button {
            padding: 6px 12px;
            background: var(--background-secondary);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          }
          .error-message {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: var(--background-error);
            color: var(--text-error);
            border-radius: 4px;
            font-size: 13px;
            margin-bottom: 10px;
          }
          .error-message button {
            background: none;
            border: none;
            color: var(--text-error);
            cursor: pointer;
            font-size: 18px;
          }
          .loading,
          .no-files {
            text-align: center;
            padding: 20px;
            color: var(--text-secondary);
            font-size: 14px;
          }
          .file-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid var(--border-primary);
            border-radius: 4px;
          }
          .file-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid var(--border-primary);
          }
          .file-item:last-child {
            border-bottom: none;
          }
          .file-item.loading {
            opacity: 0.5;
          }
          .file-info {
            flex: 1;
          }
          .file-name {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
          }
          .file-meta {
            font-size: 12px;
            color: var(--text-secondary);
            display: flex;
            gap: 10px;
          }
          .file-actions {
            display: flex;
            gap: 8px;
          }
          .file-actions button {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          }
          .open-button {
            background: var(--accent-primary);
            color: white;
          }
          .delete-button {
            background: var(--background-error);
            color: var(--text-error);
          }
          .file-actions button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .close-button {
            width: 100%;
            padding: 8px;
            margin-top: 15px;
            background: var(--background-secondary);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};