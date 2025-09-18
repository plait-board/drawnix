const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { createClient } = require('webdav');

const PORT = parseInt(process.env.PORT || '38080', 10);
const JWT_SECRET = process.env.SYNC_JWT_SECRET || 'drawnix-sync-secret';
const PASSWORD_HASH = (process.env.SYNC_PASSWORD_HASH || '').toLowerCase();
const TOKEN_TTL = process.env.SYNC_TOKEN_TTL || '30d';
const DEFAULT_LABEL = process.env.SYNC_LABEL || process.env.VITE_SYNC_LABEL || '';
const CONFIG_FILE = process.env.SYNC_CONFIG_PATH || path.join(process.cwd(), 'config', 'sync-config.json');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10mb' }));
app.use(cors());

let config = loadConfig();
let webdavClient = config.webdavUrl ? createWebDavClient(config) : null;

app.get('/api/config', (_req, res) => {
  const configured = isConfigured();
  res.json({ configured, label: buildConnectionLabel() });
});

app.get('/api/settings', authenticate, (_req, res) => {
  res.json(exposeSettings());
});

app.put('/api/settings', authenticate, async (req, res) => {
  try {
    const { url, username, password, basePath, mainFile, timeout, label } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: 'Invalid WebDAV URL' });
    }
    const updates = {
      webdavUrl: url.trim(),
      username: typeof username === 'string' ? username.trim() : undefined,
      basePath: typeof basePath === 'string' ? basePath : undefined,
      mainFile: typeof mainFile === 'string' ? mainFile : undefined,
      timeout: timeout !== undefined ? parseInt(timeout, 10) : undefined,
      label: typeof label === 'string' ? label : undefined,
    };
    if (Object.prototype.hasOwnProperty.call(req.body, 'password')) {
      updates.password = password ? String(password) : '';
    }
    applyConfig(updates);
    if (isConfigured()) {
      await ensureBasePath();
    }
    res.json(exposeSettings());
  } catch (error) {
    console.error('update settings error', error);
    res.status(502).json({ message: 'WEB_DAV_ERROR' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    if (!PASSWORD_HASH) {
      return res.status(503).json({ message: 'SYNC_NOT_CONFIGURED' });
    }
    if (!config.webdavUrl) {
      return res.status(503).json({ message: 'SYNC_NOT_CONFIGURED' });
    }
    const { password } = req.body || {};
    if (typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'PASSWORD_REQUIRED' });
    }
    const hash = sha256(password.trim());
    if (hash !== PASSWORD_HASH) {
      return res.status(401).json({ message: 'INVALID_PASSWORD' });
    }
    try {
      await ensureBasePath();
    } catch (error) {
      console.error('ensureBasePath failed', error);
      return res.status(502).json({ message: 'WEB_DAV_ERROR' });
    }
    const token = jwt.sign({ scope: 'sync' }, JWT_SECRET, { expiresIn: TOKEN_TTL });
    res.json({ token, label: buildConnectionLabel() });
  } catch (error) {
    console.error('verify error', error);
    res.status(500).json({ message: 'INTERNAL_ERROR' });
  }
});

app.get('/api/auth/session', authenticate, (_req, res) => {
  res.json({ ok: true, label: buildConnectionLabel() });
});

app.get('/api/board', authenticate, async (_req, res) => {
  if (!ensureConfigured(res)) {
    return;
  }
  try {
    const board = await loadBoard();
    res.json({ board });
  } catch (error) {
    console.error('load board error', error);
    res.status(502).json({ message: 'WEB_DAV_ERROR' });
  }
});

app.put('/api/board', authenticate, async (req, res) => {
  if (!ensureConfigured(res)) {
    return;
  }
  try {
    const board = req.body || {};
    if (!Array.isArray(board.children)) {
      return res.status(400).json({ message: 'Invalid board payload' });
    }
    const payload = {
      children: board.children,
      viewport: board.viewport || null,
      theme: board.theme || null,
      updatedAt: typeof board.updatedAt === 'number' ? board.updatedAt : Date.now(),
    };
    await saveBoard(payload);
    res.json({ board: payload });
  } catch (error) {
    console.error('save board error', error);
    res.status(502).json({ message: 'WEB_DAV_ERROR' });
  }
});

app.get('/api/files', authenticate, async (_req, res) => {
  if (!ensureConfigured(res)) {
    return;
  }
  try {
    const files = await listDrawnixFiles();
    res.json({ files });
  } catch (error) {
    console.error('list files error', error);
    res.status(502).json({ message: 'WEB_DAV_ERROR' });
  }
});

app.get('/api/files/:name', authenticate, async (req, res) => {
  if (!ensureConfigured(res)) {
    return;
  }
  try {
    const content = await downloadFile(req.params.name);
    res.type('application/json').send(content);
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({ message: 'NOT_FOUND' });
    }
    console.error('download file error', error);
    res.status(502).json({ message: 'WEB_DAV_ERROR' });
  }
});

app.post('/api/files', authenticate, async (req, res) => {
  if (!ensureConfigured(res)) {
    return;
  }
  try {
    const { name, content } = req.body || {};
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: 'INVALID_CONTENT' });
    }
    const saved = await uploadFile(name || Date.now().toString(), content);
    res.json(saved);
  } catch (error) {
    console.error('upload file error', error);
    res.status(502).json({ message: 'WEB_DAV_ERROR' });
  }
});

app.put('/api/files/:name', authenticate, async (req, res) => {
  if (!ensureConfigured(res)) {
    return;
  }
  const { newName } = req.body || {};
  if (!newName || typeof newName !== 'string') {
    return res.status(400).json({ message: 'INVALID_NAME' });
  }
  try {
    const renamed = await renameFile(req.params.name, newName);
    res.json(renamed);
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({ message: 'NOT_FOUND' });
    }
    console.error('rename file error', error);
    res.status(502).json({ message: 'WEB_DAV_ERROR' });
  }
});

app.delete('/api/files/:name', authenticate, async (req, res) => {
  if (!ensureConfigured(res)) {
    return;
  }
  try {
    await deleteFile(req.params.name);
    res.json({ ok: true });
  } catch (error) {
    if (isNotFound(error)) {
      return res.status(404).json({ message: 'NOT_FOUND' });
    }
    console.error('delete file error', error);
    res.status(502).json({ message: 'WEB_DAV_ERROR' });
  }
});

const publicDir = path.join(__dirname, '../../public');
app.use(express.static(publicDir, { index: false }));
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Drawnix server running on port ${PORT}`);
});

function authenticate(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'UNAUTHORIZED' });
  }
  const token = auth.slice('Bearer '.length);
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'UNAUTHORIZED' });
  }
}

function ensureConfigured(res) {
  if (!isConfigured()) {
    res.status(503).json({ message: 'SYNC_NOT_CONFIGURED' });
    return false;
  }
  return true;
}

function isConfigured() {
  return Boolean(PASSWORD_HASH && config.webdavUrl);
}

function exposeSettings() {
  return {
    url: config.webdavUrl,
    username: config.username || '',
    basePath: config.basePath,
    mainFile: config.mainFile,
    timeout: config.timeout,
    label: buildConnectionLabel(),
    passwordSet: Boolean(config.password),
  };
}

function applyConfig(updates) {
  const next = {
    ...config,
  };
  if (typeof updates.webdavUrl === 'string') {
    next.webdavUrl = updates.webdavUrl.trim();
  }
  if (typeof updates.username === 'string') {
    next.username = updates.username;
  }
  if (updates.password !== undefined) {
    next.password = updates.password;
  }
  if (typeof updates.basePath === 'string') {
    next.basePath = normalizePath(updates.basePath);
  }
  if (typeof updates.mainFile === 'string' && updates.mainFile.trim()) {
    next.mainFile = updates.mainFile.trim();
  }
  if (updates.timeout !== undefined) {
    const parsed = parseInt(updates.timeout, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      next.timeout = parsed;
    }
  }
  if (typeof updates.label === 'string') {
    next.label = updates.label.trim();
  }
  config = next;
  saveConfig(config);
  webdavClient = config.webdavUrl ? createWebDavClient(config) : null;
}

function loadConfig() {
  let fileConfig = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
      fileConfig = JSON.parse(raw);
    }
  } catch (error) {
    console.warn('Failed to read sync config file', error);
  }
  const envConfig = {
    webdavUrl: process.env.WEBDAV_URL || '',
    username: process.env.WEBDAV_USERNAME || '',
    password: process.env.WEBDAV_PASSWORD || '',
    basePath: process.env.WEBDAV_BASE_PATH || '/drawnix',
    mainFile: process.env.WEBDAV_MAIN_FILE || 'main-board.json',
    timeout: parseInt(process.env.WEBDAV_TIMEOUT || '10000', 10),
    label: DEFAULT_LABEL,
  };
  const merged = {
    webdavUrl: String(fileConfig.webdavUrl || envConfig.webdavUrl || '').trim(),
    username:
      fileConfig.username !== undefined
        ? String(fileConfig.username)
        : envConfig.username,
    password:
      fileConfig.password !== undefined
        ? String(fileConfig.password)
        : envConfig.password,
    basePath: normalizePath(fileConfig.basePath || envConfig.basePath),
    mainFile: (fileConfig.mainFile || envConfig.mainFile).trim(),
    timeout: parseInt(fileConfig.timeout ?? envConfig.timeout, 10) || 10000,
    label:
      fileConfig.label !== undefined
        ? String(fileConfig.label)
        : envConfig.label,
  };
  return merged;
}

function saveConfig(nextConfig) {
  try {
    fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
    const persist = {
      webdavUrl: nextConfig.webdavUrl,
      username: nextConfig.username,
      password: nextConfig.password,
      basePath: nextConfig.basePath,
      mainFile: nextConfig.mainFile,
      timeout: nextConfig.timeout,
      label: nextConfig.label,
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(persist, null, 2), 'utf8');
  } catch (error) {
    console.warn('Failed to write sync config file', error);
  }
}

function createWebDavClient(cfg) {
  if (!cfg.webdavUrl) {
    return null;
  }
  return createClient(cfg.webdavUrl, {
    username: cfg.username || undefined,
    password: cfg.password || undefined,
    maxBodyLength: 10 * 1024 * 1024,
    responseType: 'text',
    headers: {},
    requestOptions: {
      mode: 'cors',
      referrerPolicy: 'no-referrer',
      credentials: 'omit',
    },
  });
}

function getClient() {
  if (!config.webdavUrl) {
    throw new Error('SYNC_NOT_CONFIGURED');
  }
  if (!webdavClient) {
    webdavClient = createWebDavClient(config);
  }
  return webdavClient;
}

async function ensureBasePath() {
  if (!config.basePath || config.basePath === '/') {
    return;
  }
  const client = getClient();
  const segments = config.basePath.split('/').filter(Boolean);
  let current = '';
  for (const segment of segments) {
    current += `/${segment}`;
    try {
      await client.stat(current);
    } catch (error) {
      if (isNotFound(error)) {
        await client.createDirectory(current);
      } else {
        throw error;
      }
    }
  }
}

async function loadBoard() {
  const client = getClient();
  const remotePath = resolveWebDavPath(config.mainFile);
  try {
    const content = await client.getFileContents(remotePath, { format: 'text' });
    if (!content) {
      return null;
    }
    const data = JSON.parse(content.toString());
    return isBoardState(data) ? data : null;
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }
    throw error;
  }
}

async function saveBoard(board) {
  const client = getClient();
  const remotePath = resolveWebDavPath(config.mainFile);
  await client.putFileContents(remotePath, JSON.stringify(board, null, 2), {
    overwrite: true,
    contentType: 'application/json',
  });
}

async function listDrawnixFiles() {
  const client = getClient();
  await ensureBasePath();
  const entries = await client.getDirectoryContents(config.basePath, {
    deep: false,
  });
  return entries
    .filter((item) => item.type === 'file' && item.basename.endsWith('.drawnix'))
    .map((item) => ({
      name: item.basename,
      size: typeof item.size === 'number' ? item.size : 0,
      updatedAt: item.lastmod ? new Date(item.lastmod).getTime() : Date.now(),
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

async function downloadFile(name) {
  const client = getClient();
  const remotePath = resolveWebDavPath(name);
  const content = await client.getFileContents(remotePath, { format: 'text' });
  return content ? content.toString() : '';
}

async function uploadFile(name, content) {
  const client = getClient();
  const safeName = sanitizeFileName(name);
  const remotePath = resolveWebDavPath(safeName);
  await client.putFileContents(remotePath, content, {
    overwrite: true,
    contentType: 'application/json',
  });
  const stat = await client.stat(remotePath);
  return {
    name: safeName,
    size: typeof stat.size === 'number' ? stat.size : content.length,
    updatedAt: stat.lastmod ? new Date(stat.lastmod).getTime() : Date.now(),
  };
}

async function renameFile(oldName, newName) {
  const client = getClient();
  const safeNewName = sanitizeFileName(newName);
  if (safeNewName === oldName) {
    const stat = await client.stat(resolveWebDavPath(oldName));
    return {
      name: oldName,
      size: typeof stat.size === 'number' ? stat.size : 0,
      updatedAt: stat.lastmod ? new Date(stat.lastmod).getTime() : Date.now(),
    };
  }
  const source = resolveWebDavPath(oldName);
  const target = resolveWebDavPath(safeNewName);
  await client.moveFile(source, target, { overwrite: false });
  const stat = await client.stat(target);
  return {
    name: safeNewName,
    size: typeof stat.size === 'number' ? stat.size : 0,
    updatedAt: stat.lastmod ? new Date(stat.lastmod).getTime() : Date.now(),
  };
}

async function deleteFile(name) {
  const client = getClient();
  const remotePath = resolveWebDavPath(name);
  await client.deleteFile(remotePath);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalizePath(value) {
  if (!value) {
    return '/';
  }
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === '/') {
    return '/';
  }
  const withoutTrailing = trimmed.replace(/\/+$/, '');
  return withoutTrailing.startsWith('/')
    ? withoutTrailing
    : `/${withoutTrailing}`;
}

function resolveWebDavPath(name) {
  const sanitized = name.replace(/^\/+/, '');
  if (!config.basePath || config.basePath === '/') {
    return `/${sanitized}`;
  }
  return `${config.basePath}/${sanitized}`;
}

function sanitizeFileName(name) {
  const trimmed = (name || '').trim();
  const withExt = trimmed.endsWith('.drawnix')
    ? trimmed
    : `${trimmed || Date.now().toString()}.drawnix`;
  return withExt.replace(/[^a-zA-Z0-9\-_.]/g, '_');
}

function isBoardState(value) {
  return value && Array.isArray(value.children) && typeof value.updatedAt === 'number';
}

function isNotFound(error) {
  const status = error?.statusCode || error?.status || error?.response?.status;
  return status === 404;
}

function buildConnectionLabel() {
  if (config.label) {
    return config.label;
  }
  if (!config.webdavUrl) {
    return '';
  }
  return `${config.webdavUrl}${config.basePath === '/' ? '' : config.basePath}`;
}
