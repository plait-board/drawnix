import React, { useState, useEffect } from 'react';
import { WebDAVConfig } from '../../data/webdav-types';
import { testConnection, createWebDAVClient } from '../../data/webdav';
import { useI18n } from '../../i18n';

interface WebDAVConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: WebDAVConfig) => void;
  initialConfig?: WebDAVConfig | null;
}

export const WebDAVConfigDialog: React.FC<WebDAVConfigDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig,
}) => {
  const { t } = useI18n();
  const [url, setUrl] = useState(initialConfig?.url || '');
  const [username, setUsername] = useState(initialConfig?.username || '');
  const [password, setPassword] = useState(initialConfig?.password || '');
  const [path, setPath] = useState(initialConfig?.path || '/');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (initialConfig) {
      setUrl(initialConfig.url);
      setUsername(initialConfig.username || '');
      setPassword(initialConfig.password || '');
      setPath(initialConfig.path || '/');
    }
  }, [initialConfig]);

  const handleTestConnection = async () => {
    if (!url) {
      setTestResult({ success: false, message: t('webdav.config.testFail') + ': URL 不能为空' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const config: WebDAVConfig = {
        url,
        username: username || undefined,
        password: password || undefined,
        path: path || '/',
      };

      const result = await testConnection(config);
      if (result.success) {
        setTestResult({ success: true, message: t('webdav.config.testSuccess') });
      } else {
        setTestResult({ success: false, message: t('webdav.config.testFail') + ': ' + result.error });
      }
    } catch (error: any) {
      setTestResult({ success: false, message: t('webdav.config.testFail') + ': ' + error.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (!url) {
      setTestResult({ success: false, message: 'URL 不能为空' });
      return;
    }

    const config: WebDAVConfig = {
      url,
      username: username || undefined,
      password: password || undefined,
      path: path || '/',
    };

    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="webdav-config-dialog-overlay">
      <div className="webdav-config-dialog">
        <div className="dialog-header">
          <h2>{t('webdav.config.title')}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="dialog-body">
          <div className="form-group">
            <label htmlFor="url">{t('webdav.config.url')} *</label>
            <input
              id="url"
              type="url"
              placeholder="https://dav.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">{t('webdav.config.username')}</label>
            <input
              id="username"
              type="text"
              placeholder={t('webdav.config.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('webdav.config.password')}</label>
            <input
              id="password"
              type="password"
              placeholder={t('webdav.config.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="path">{t('webdav.config.path')}</label>
            <input
              id="path"
              type="text"
              placeholder="/"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </div>

          {testResult && (
            <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
              {testResult.message}
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button
            onClick={handleTestConnection}
            disabled={testing || !url}
            className="test-button"
          >
            {testing ? '测试中...' : t('webdav.config.testConnection')}
          </button>
          <div className="button-group">
            <button onClick={onClose} className="cancel-button">
              {t('webdav.config.cancel')}
            </button>
            <button onClick={handleSave} className="save-button">
              {t('webdav.config.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

WebDAVConfigDialog.displayName = 'WebDAVConfigDialog';

export default WebDAVConfigDialog;