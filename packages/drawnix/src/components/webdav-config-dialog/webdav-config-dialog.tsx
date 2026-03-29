import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../dialog/dialog';
import { useDrawnix } from '../../hooks/use-drawnix';
import { testConnection, createWebDAVClient } from '../../data/webdav';
import type { WebDAVConfig } from '../../data/webdav-types';
import { useI18n } from '../../i18n';

interface WebDAVConfigDialogProps {
  container: HTMLElement | null;
}

export const WebDAVConfigDialog = ({ container }: WebDAVConfigDialogProps) => {
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();

  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [path, setPath] = useState('/');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);

  const loadSavedConfig = () => {
    const savedConfig = localStorage.getItem('webdav_config');
    if (savedConfig) {
      try {
        const config: WebDAVConfig = JSON.parse(savedConfig);
        setUrl(config.url || '');
        setUsername(config.username || '');
        setPassword(config.password || '');
        setPath(config.path || '/');
        setAppState({ ...appState, webdavConfig: config });
      } catch (error) {
        console.error('Failed to load WebDAV config:', error);
      }
    }
  };

  useEffect(() => {
    loadSavedConfig();
  }, []);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    const config: WebDAVConfig = {
      url,
      username,
      password,
      path,
    };

    const result = await testConnection(config);
    setTestResult(result);
    setTesting(false);

    if (result.success) {
      createWebDAVClient(config);
      setAppState({ ...appState, webdavConfig: config });
    }
  };

  const handleSave = () => {
    const config: WebDAVConfig = {
      url,
      username,
      password,
      path,
    };

    localStorage.setItem('webdav_config', JSON.stringify(config));
    createWebDAVClient(config);
    setAppState({
      ...appState,
      webdavConfig: config,
      openWebDAVConfigDialog: false,
    });

    closeDialog();
  };

  const closeDialog = () => {
    setTestResult(null);
    setAppState({
      ...appState,
      openWebDAVConfigDialog: false,
    });
  };

  return (
    <Dialog
      open={appState.openWebDAVConfigDialog}
      onOpenChange={closeDialog}
    >
      <DialogContent
        className="Dialog webdav-config-dialog"
        container={container}
      >
        <div className="webdav-config-content">
          <h2>{t('webdav configuring')}</h2>
          <div className="webdav-config-form">
            <div className="form-group">
              <label>URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/webdav"
              />
            </div>
            <div className="form-group">
              <label>{t('webdav username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('webdav username placeholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('webdav password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('webdav password placeholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('webdav path')}</label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/"
              />
            </div>

            {testResult && (
              <div
                className={`test-result ${
                  testResult.success ? 'success' : 'error'
                }`}
              >
                {testResult.success
                  ? testResult.message
                  : testResult.error}
              </div>
            )}

            <div className="form-actions">
              <button
                className="test-button"
                onClick={handleTest}
                disabled={testing || !url}
              >
                {testing ? t('testing') : t('test connection')}
              </button>
              <button
                className="save-button"
                onClick={handleSave}
                disabled={!url || !testResult?.success}
              >
                {t('save')}
              </button>
              <button className="cancel-button" onClick={closeDialog}>
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>

        <style>{`
          .webdav-config-content {
            padding: 20px;
            min-width: 400px;
          }
          .webdav-config-content h2 {
            margin: 0 0 15px 0;
            font-size: 18px;
          }
          .webdav-config-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .form-group label {
            font-size: 12px;
            color: var(--text-secondary);
          }
          .form-group input {
            padding: 8px;
            border: 1px solid var(--border-primary);
            border-radius: 4px;
            font-size: 13px;
          }
          .test-result {
            padding: 10px;
            border-radius: 4px;
            font-size: 13px;
          }
          .test-result.success {
            background: var(--background-success);
            color: var(--text-success);
          }
          .test-result.error {
            background: var(--background-error);
            color: var(--text-error);
          }
          .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }
          .form-actions button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          }
          .test-button {
            background: var(--background-secondary);
          }
          .save-button {
            background: var(--accent-primary);
            color: white;
          }
          .button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .cancel-button {
            background: var(--background-secondary);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};