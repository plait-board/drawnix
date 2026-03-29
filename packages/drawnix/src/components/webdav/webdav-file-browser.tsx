import React, { useState, useEffect } from 'react';
import { WebDAVFile } from '../../data/webdav-types';
import { useI18n } from '../../i18n';

interface WebDAVFileBrowserProps {
  files: WebDAVFile[];
  onSelectFile: (file: WebDAVFile) => void;
  onClose?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const WebDAVFileBrowser: React.FC<WebDAVFileBrowserProps> = ({
  files,
  onSelectFile,
  onClose,
  loading = false,
  error = null,
}) => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="webdav-file-browser">
      <div className="file-browser-header">
        <h3>{t('webdav.fileBrowser.title')}</h3>
        {onClose && (
          <button onClick={onClose} className="close-button">
            ×
          </button>
        )}
      </div>

      <div className="search-input">
        <input
          type="text"
          placeholder={t('menu.search', '搜索...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <div className="loading">加载中...</div>}

      {error && <div className="error">{error}</div>}

      {!loading && !error && filteredFiles.length === 0 && (
        <div className="empty-state">
          {searchQuery ? '没有找到匹配的文件' : '没有文件'}
        </div>
      )}

      {!loading && !error && filteredFiles.length > 0 && (
        <ul className="file-list">
          {filteredFiles.map((file) => (
            <li
              key={file.filename}
              className="file-item"
              onClick={() => onSelectFile(file)}
            >
              <div className="file-info">
                <div className="file-icon">
                  {file.filename.endsWith('.drawnix') && '📄'}
                  {file.filename.endsWith('.json') && '📋'}
                </div>
                <div className="file-details">
                  <div className="file-name">{file.filename}</div>
                  <div className="file-meta">
                    {formatSize(file.size)} • {formatDate(file.lastmodified)}
                  </div>
                </div>
              </div>
              <button className="open-button">{t('webdav.fileBrowser.open')}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

WebDAVFileBrowser.displayName = 'WebDAVFileBrowser';

export default WebDAVFileBrowser;