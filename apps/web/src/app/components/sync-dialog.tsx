import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeading,
  DialogClose,
} from '@drawnix/drawnix';
import { useI18n } from '@drawnix/drawnix';
import {
  ServerFileSummary,
  SyncStatus,
  WebDavSettings,
  UpdateWebDavSettingsInput,
} from '../sync-gateway';
import './sync-dialog.scss';

export type SyncDialogProps = {
  container: HTMLElement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: SyncStatus;
  connectionLabel?: string;
  lastSyncedAt?: number;
  error?: string;
  isVerifying: boolean;
  onVerify: (password: string) => Promise<void>;
  onSignOut: () => Promise<void> | void;
  hasSession: boolean;
  isConfigured: boolean;
  files: ServerFileSummary[];
  isLoadingFiles: boolean;
  onRefreshFiles: () => void;
  onSaveFile: (name: string) => Promise<void>;
  onLoadFile: (name: string) => Promise<void>;
  onRenameFile: (oldName: string, newName: string) => Promise<void>;
  onDeleteFile: (name: string) => Promise<void>;
  settings?: WebDavSettings | null;
  onUpdateSettings: (settings: UpdateWebDavSettingsInput) => Promise<WebDavSettings | void>;
  isUpdatingSettings: boolean;
  defaultFileName: string;
};

type SettingsFormState = {
  url: string;
  username: string;
  password: string;
  basePath: string;
  mainFile: string;
  timeout: string;
  label: string;
  passwordSet: boolean;
  clearPassword: boolean;
};

type PaginationState = {
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE_SIZE = 8;
const PAGE_SIZE_OPTIONS = [5, 8, 12, 20];

const createSettingsForm = (settings?: WebDavSettings | null): SettingsFormState => ({
  url: settings?.url || '',
  username: settings?.username || '',
  password: '',
  basePath: settings?.basePath || '/drawnix',
  mainFile: settings?.mainFile || 'main-board.json',
  timeout: settings ? String(settings.timeout ?? '') : '',
  label: settings?.label || '',
  passwordSet: Boolean(settings?.passwordSet),
  clearPassword: false,
});

const formatLastSynced = (value?: number) => {
  if (!value) {
    return '';
  }
  const formatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return formatter.format(new Date(value));
};

export function SyncDialog(props: SyncDialogProps) {
  const {
    container,
    open,
    onOpenChange,
    status,
    connectionLabel,
    lastSyncedAt,
    error,
    isVerifying,
    onVerify,
    onSignOut,
    hasSession,
    isConfigured,
    files,
    isLoadingFiles,
    onRefreshFiles,
    onSaveFile,
    onLoadFile,
    onRenameFile,
    onDeleteFile,
    settings,
    onUpdateSettings,
    isUpdatingSettings,
    defaultFileName,
  } = props;

  const { t } = useI18n();

  const [password, setPassword] = useState('');
  const [fileName, setFileName] = useState(defaultFileName);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<SettingsFormState>(
    createSettingsForm(settings)
  );
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    if (open) {
      setFileName(defaultFileName);
      setFormError(null);
      setSettingsMessage(null);
      setSettingsError(null);
    } else {
      setSettingsOpen(false);
    }
  }, [open, defaultFileName]);

  useEffect(() => {
    setSettingsForm(createSettingsForm(settings));
  }, [settings, open]);

  const statusLabel = useMemo(() => t(`sync.status.${status}`), [status, t]);
  const formattedLastSynced = useMemo(
    () => formatLastSynced(lastSyncedAt),
    [lastSyncedAt]
  );

  const translatedError = useMemo(() => {
    if (!error) {
      return '';
    }
    switch (error) {
      case 'connection-error':
        return t('sync.dialog.connectionError');
      case 'list-error':
        return t('sync.dialog.listError');
      case 'upload-error':
        return t('sync.dialog.uploadError');
      case 'download-error':
        return t('sync.dialog.downloadError');
      case 'delete-error':
        return t('sync.dialog.deleteError');
      default:
        return error;
    }
  }, [error, t]);

  const paginatedFiles = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return files.slice(start, start + pagination.pageSize);
  }, [files, pagination.page, pagination.pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(files.length / pagination.pageSize)),
    [files.length, pagination.pageSize]
  );

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(prev.page, totalPages),
    }));
  }, [totalPages]);

  const resetErrors = () => {
    setFormError(null);
    setSettingsMessage(null);
    setSettingsError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) {
      setFormError(t('sync.dialog.passwordRequired'));
      return;
    }
    if (!isConfigured) {
      setFormError(t('sync.dialog.configMissing'));
      return;
    }
    resetErrors();
    try {
      await onVerify(trimmed);
      setPassword('');
    } catch (err: any) {
      const message = err?.message || '';
      if (message === 'INVALID_PASSWORD') {
        setFormError(t('sync.dialog.invalidPassword'));
      } else if (message === 'SYNC_NOT_CONFIGURED') {
        setFormError(t('sync.dialog.configMissing'));
      } else {
        setFormError(t('sync.dialog.connectionError'));
      }
    }
  };

  const handleSave = async () => {
    const trimmed = fileName.trim();
    if (!trimmed) {
      setFormError(t('sync.dialog.fileNameRequired'));
      return;
    }
    resetErrors();
    try {
      setSaving(true);
      await onSaveFile(trimmed);
    } catch (err: any) {
      const message = err?.message;
      if (message === 'UPLOAD_ERROR' || message === 'upload-error') {
        setFormError(t('sync.dialog.uploadError'));
      } else {
        setFormError(message || t('sync.dialog.error'));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async (name: string) => {
    resetErrors();
    try {
      setLoadingFile(name);
      await onLoadFile(name);
    } catch (err: any) {
      const message = err?.message;
      if (
        message === 'DOWNLOAD_ERROR' ||
        message === 'INVALID_FILE' ||
        message === 'download-error'
      ) {
        setFormError(t('sync.dialog.downloadError'));
      } else {
        setFormError(message || t('sync.dialog.error'));
      }
    } finally {
      setLoadingFile(null);
    }
  };

  const handleRename = async (file: ServerFileSummary) => {
    if (!isConfigured) {
      return;
    }
    const promptValue = window.prompt(
      t('sync.dialog.renamePrompt'),
      file.name.replace(/\.drawnix$/i, '')
    );
    if (promptValue === null) {
      return;
    }
    const trimmed = promptValue.trim();
    if (!trimmed || `${trimmed}.drawnix` === file.name) {
      return;
    }
    resetErrors();
    try {
      setRenamingFile(file.name);
      await onRenameFile(file.name, trimmed);
    } catch (err: any) {
      const message = err?.message || '';
      if (message === 'upload-error') {
        setFormError(t('sync.dialog.uploadError'));
      } else {
        setFormError(message || t('sync.dialog.error'));
      }
    } finally {
      setRenamingFile(null);
    }
  };

  const handleDelete = async (file: ServerFileSummary) => {
    if (!isConfigured) {
      return;
    }
    if (!window.confirm(t('sync.dialog.deleteConfirm'))) {
      return;
    }
    resetErrors();
    try {
      setDeletingFile(file.name);
      await onDeleteFile(file.name);
    } catch (err: any) {
      const message = err?.message || '';
      if (message === 'delete-error') {
        setFormError(t('sync.dialog.deleteError'));
      } else {
        setFormError(message || t('sync.dialog.error'));
      }
    } finally {
      setDeletingFile(null);
    }
  };

  const handleSettingsChange = (field: keyof SettingsFormState, value: string) => {
    setSettingsMessage(null);
    setSettingsError(null);
    setSettingsForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'password' ? { clearPassword: false } : {}),
    }));
  };

  const toggleClearPassword = () => {
    setSettingsMessage(null);
    setSettingsError(null);
    setSettingsForm((prev) => ({
      ...prev,
      clearPassword: !prev.clearPassword,
      password: '',
    }));
  };

  const handleSettingsSubmit = async () => {
    const payload: UpdateWebDavSettingsInput = {
      url: settingsForm.url.trim(),
      username: settingsForm.username.trim() || undefined,
      basePath: settingsForm.basePath.trim() || '/drawnix',
      mainFile: settingsForm.mainFile.trim() || 'main-board.json',
      label: settingsForm.label.trim(),
      timeout: settingsForm.timeout.trim()
        ? Number(settingsForm.timeout.trim())
        : undefined,
    };
    if (settingsForm.password.trim()) {
      payload.password = settingsForm.password;
    } else if (settingsForm.clearPassword) {
      payload.password = '';
    }
    setSettingsError(null);
    setSettingsMessage(null);
    try {
      const updated = await onUpdateSettings(payload);
      if (updated) {
        setSettingsForm(createSettingsForm(updated));
      } else {
        setSettingsForm((prev) => ({
          ...prev,
          password: '',
        }));
      }
      setSettingsMessage(t('sync.dialog.settings.success'));
    } catch (err: any) {
      const message = err?.message || '';
      if (message === 'WEB_DAV_ERROR' || message === 'connection-error') {
        setSettingsError(t('sync.dialog.connectionError'));
      } else if (message === 'SYNC_NOT_CONFIGURED') {
        setSettingsError(t('sync.dialog.configMissing'));
      } else {
        setSettingsError(message || t('sync.dialog.settings.error'));
      }
    }
  };

  const lastSyncedRow = formattedLastSynced ? (
    <span className="sync-dialog__status-meta">
      {t('sync.dialog.lastSyncedPrefix')}
      {formattedLastSynced}
    </span>
  ) : null;

  const goToPage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.min(Math.max(1, page), totalPages),
    }));
  };

  const handleSignOutClick = async () => {
    await onSignOut();
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sync-dialog" container={container}>
        <div className="sync-dialog__header">
          <DialogHeading>{t('sync.dialog.title')}</DialogHeading>
          <DialogClose className="sync-dialog__close" aria-label={t('sync.dialog.close')}>
            ×
          </DialogClose>
        </div>
        <div className="sync-dialog__status">
          <div className="sync-dialog__status-main">
            <span className="sync-dialog__status-label">
              {t('sync.dialog.status')}: {statusLabel}
            </span>
            {translatedError ? (
              <span className="sync-dialog__status-error">{translatedError}</span>
            ) : null}
          </div>
          <div className="sync-dialog__status-meta-row">
            {connectionLabel && hasSession ? (
              <span className="sync-dialog__status-meta">{connectionLabel}</span>
            ) : null}
            {lastSyncedRow}
          </div>
          {!isConfigured ? (
            <span className="sync-dialog__status-error">
              {t('sync.dialog.configMissing')}
            </span>
          ) : null}
          {hasSession ? (
            <button
              type="button"
              className="sync-dialog__button sync-dialog__button--secondary sync-dialog__settings-toggle"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              {settingsOpen
                ? t('sync.dialog.settings.hide')
                : t('sync.dialog.settings.show')}
            </button>
          ) : null}
        </div>
        <form className="sync-dialog__form" onSubmit={handleSubmit}>
          <label className="sync-dialog__label" htmlFor="sync-password">
            {t('sync.dialog.password')}
          </label>
          <input
            id="sync-password"
            className="sync-dialog__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('sync.dialog.passwordPlaceholder')}
            disabled={!isConfigured || isVerifying}
          />
          {formError ? (
            <div className="sync-dialog__error" role="alert">
              {formError}
            </div>
          ) : null}
          <div className="sync-dialog__form-actions">
            <button
              className="sync-dialog__button"
              type="submit"
              disabled={isVerifying || !isConfigured}
            >
              {isVerifying ? t('sync.dialog.verifying') : t('sync.dialog.verify')}
            </button>
            {hasSession ? (
              <button
                type="button"
                className="sync-dialog__button sync-dialog__button--secondary"
                onClick={handleSignOutClick}
                disabled={isVerifying}
              >
                {t('sync.dialog.signOut')}
              </button>
            ) : null}
          </div>
        </form>

        {hasSession && settingsOpen ? (
          <div className="sync-dialog__section sync-dialog__settings">
            <h4 className="sync-dialog__section-title">
              {t('sync.dialog.settings.title')}
            </h4>
            <div className="sync-dialog__settings-grid">
              <div className="sync-dialog__settings-field">
                <label className="sync-dialog__label" htmlFor="settings-url">
                  {t('sync.dialog.settings.url')}
                </label>
                <input
                  id="settings-url"
                  className="sync-dialog__input"
                  value={settingsForm.url}
                  onChange={(event) =>
                    handleSettingsChange('url', event.target.value)
                  }
                />
              </div>
              <div className="sync-dialog__settings-field">
                <label className="sync-dialog__label" htmlFor="settings-username">
                  {t('sync.dialog.settings.username')}
                </label>
                <input
                  id="settings-username"
                  className="sync-dialog__input"
                  value={settingsForm.username}
                  onChange={(event) =>
                    handleSettingsChange('username', event.target.value)
                  }
                />
              </div>
              <div className="sync-dialog__settings-field">
                <label className="sync-dialog__label" htmlFor="settings-password">
                  {t('sync.dialog.settings.password')}
                </label>
                <input
                  id="settings-password"
                  className="sync-dialog__input"
                  type="password"
                  value={settingsForm.password}
                  onChange={(event) =>
                    handleSettingsChange('password', event.target.value)
                  }
                  placeholder={settingsForm.passwordSet ? '••••••••' : ''}
                />
                <span className="sync-dialog__settings-hint">
                  {t('sync.dialog.settings.passwordHint')}
                </span>
                <label className="sync-dialog__settings-hint">
                  <input
                    type="checkbox"
                    checked={settingsForm.clearPassword}
                    onChange={toggleClearPassword}
                  />{' '}
                  {t('sync.dialog.settings.clearPassword')}
                </label>
              </div>
              <div className="sync-dialog__settings-field">
                <label className="sync-dialog__label" htmlFor="settings-basePath">
                  {t('sync.dialog.settings.basePath')}
                </label>
                <input
                  id="settings-basePath"
                  className="sync-dialog__input"
                  value={settingsForm.basePath}
                  onChange={(event) =>
                    handleSettingsChange('basePath', event.target.value)
                  }
                />
              </div>
              <div className="sync-dialog__settings-field">
                <label className="sync-dialog__label" htmlFor="settings-mainFile">
                  {t('sync.dialog.settings.mainFile')}
                </label>
                <input
                  id="settings-mainFile"
                  className="sync-dialog__input"
                  value={settingsForm.mainFile}
                  onChange={(event) =>
                    handleSettingsChange('mainFile', event.target.value)
                  }
                />
              </div>
              <div className="sync-dialog__settings-field">
                <label className="sync-dialog__label" htmlFor="settings-timeout">
                  {t('sync.dialog.settings.timeout')}
                </label>
                <input
                  id="settings-timeout"
                  className="sync-dialog__input"
                  value={settingsForm.timeout}
                  onChange={(event) =>
                    handleSettingsChange('timeout', event.target.value)
                  }
                />
              </div>
              <div className="sync-dialog__settings-field">
                <label className="sync-dialog__label" htmlFor="settings-label">
                  {t('sync.dialog.settings.label')}
                </label>
                <input
                  id="settings-label"
                  className="sync-dialog__input"
                  value={settingsForm.label}
                  onChange={(event) =>
                    handleSettingsChange('label', event.target.value)
                  }
                />
              </div>
            </div>
            <div className="sync-dialog__settings-footer">
              <button
                type="button"
                className="sync-dialog__button"
                onClick={handleSettingsSubmit}
                disabled={isUpdatingSettings}
              >
                {isUpdatingSettings
                  ? t('sync.dialog.settings.saving')
                  : t('sync.dialog.settings.save')}
              </button>
              {settingsMessage ? (
                <span className="sync-dialog__settings-message">{settingsMessage}</span>
              ) : null}
              {settingsError ? (
                <span className="sync-dialog__settings-error">{settingsError}</span>
              ) : null}
            </div>
          </div>
        ) : null}

        {hasSession ? (
          <div className="sync-dialog__section">
            <h4 className="sync-dialog__section-title">{t('sync.dialog.saveFile')}</h4>
            <div className="sync-dialog__save">
              <input
                className="sync-dialog__input"
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                placeholder={t('sync.dialog.fileNamePlaceholder')}
                disabled={!isConfigured}
              />
              <button
                className="sync-dialog__button"
                type="button"
                onClick={handleSave}
                disabled={saving || !isConfigured}
              >
                {saving ? t('sync.dialog.saving') : t('sync.dialog.save')}
              </button>
            </div>
          </div>
        ) : null}

        {hasSession ? (
          <div className="sync-dialog__section">
            <div className="sync-dialog__section-header">
              <h4 className="sync-dialog__section-title">{t('sync.dialog.files')}</h4>
              <div className="sync-dialog__file-toolbar">
                <label className="sync-dialog__label" htmlFor="sync-page-size">
                  {t('sync.dialog.pageSize')}
                </label>
                <select
                  id="sync-page-size"
                  className="sync-dialog__input sync-dialog__page-size"
                  value={pagination.pageSize}
                  onChange={(event) =>
                    setPagination({
                      page: 1,
                      pageSize: Number(event.target.value),
                    })
                  }
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="sync-dialog__button sync-dialog__button--secondary"
                  onClick={() => {
                    setFormError(null);
                    onRefreshFiles();
                  }}
                  disabled={isLoadingFiles || !isConfigured}
                >
                  {isLoadingFiles ? t('sync.dialog.loading') : t('sync.dialog.refresh')}
                </button>
              </div>
            </div>
            {files.length === 0 && !isLoadingFiles ? (
              <div className="sync-dialog__empty">{t('sync.dialog.noFiles')}</div>
            ) : null}
            {files.length > 0 ? (
              <>
                <ul className="sync-dialog__file-list">
                  {paginatedFiles.map((file) => (
                    <li key={file.name} className="sync-dialog__file-item">
                      <div className="sync-dialog__file-info">
                        <span className="sync-dialog__file-name">{file.name}</span>
                        <span className="sync-dialog__file-meta">
                          {new Date(file.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="sync-dialog__file-actions">
                        <button
                          type="button"
                          onClick={() => handleLoad(file.name)}
                          disabled={
                            loadingFile === file.name ||
                            isLoadingFiles ||
                            !isConfigured
                          }
                        >
                          {loadingFile === file.name
                            ? t('sync.dialog.loading')
                            : t('sync.dialog.load')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRename(file)}
                          disabled={
                            renamingFile === file.name ||
                            deletingFile === file.name ||
                            !isConfigured
                          }
                        >
                          {t('sync.dialog.rename')}
                        </button>
                        <button
                          type="button"
                          className="sync-dialog__danger"
                          onClick={() => handleDelete(file)}
                          disabled={
                            deletingFile === file.name ||
                            renamingFile === file.name ||
                            !isConfigured
                          }
                        >
                          {deletingFile === file.name
                            ? t('sync.dialog.loading')
                            : t('sync.dialog.delete')}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="sync-dialog__pagination">
                  <button
                    type="button"
                    className="sync-dialog__button sync-dialog__button--secondary"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    ‹
                  </button>
                  <span className="sync-dialog__pagination-info">
                    {pagination.page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="sync-dialog__button sync-dialog__button--secondary"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page >= totalPages}
                  >
                    ›
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
