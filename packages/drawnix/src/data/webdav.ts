import { createClient } from 'webdav';
import type {
  WebDAVConfig,
  WebDAVClientConfig,
  WebDAVDeleteResult,
  WebDAVListResult,
  WebDAVLoadResult,
  WebDAVSaveResult,
  WebDAVTestConnectionResult,
} from './webdav-types';

let webdavClient: ReturnType<typeof createClient> | null = null;
let currentConfig: WebDAVConfig | null = null;

export const createWebDAVClient = (config: WebDAVConfig): void => {
  const clientConfig: WebDAVClientConfig = {
    serverUrl: config.url,
    username: config.username,
    password: config.password,
  };
  webdavClient = createClient(clientConfig);
  currentConfig = config;
};

export const getWebDAVClient = () => webdavClient;

export const getCurrentConfig = () => currentConfig;

export const testConnection = async (
  config: WebDAVConfig
): Promise<WebDAVTestConnectionResult> => {
  try {
    createWebDAVClient(config);
    if (!webdavClient) {
      return {
        success: false,
        error: 'Failed to create WebDAV client',
      };
    }

    const targetPath = config.path || '/';
    await webdavClient.exists(targetPath);

    return {
      success: true,
      message: 'Connection successful',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Connection failed',
    };
  }
};

export const listFiles = async (
  path?: string
): Promise<WebDAVListResult> => {
  if (!webdavClient) {
    return {
      success: false,
      files: [],
      error: 'WebDAV client not initialized',
    };
  }

  try {
    const targetPath = path || currentConfig?.path || '/';
    const directoryContents = await webdavClient.getDirectoryContents(
      targetPath
    );

    const items = Array.isArray(directoryContents)
      ? directoryContents
      : [directoryContents];

    const files = items.filter((item) => item.type === 'file');

    return {
      success: true,
      files: files.map((file) => ({
        filename: file.filename,
        size: file.size,
        lastmodified: new Date(file.lastmodified),
        type: file.type,
        href: file.href,
        depth: file.depth,
        etag: file.etag,
        status: file.status,
        props: file.props,
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      files: [],
      error: error.message || 'Failed to list files',
    };
  }
};

export const loadFile = async (filename: string): Promise<WebDAVLoadResult> => {
  if (!webdavClient) {
    return {
      success: false,
      error: 'WebDAV client not initialized',
    };
  }

  try {
    const targetPath = currentConfig?.path || '/';
    const filepath = targetPath === '/' ? filename : `${targetPath}/${filename}`;

    const content = await webdavClient.getFileContents(filepath, {
      format: 'text',
    });

    return {
      success: true,
      data: content as string,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to load file',
    };
  }
};

export const saveFile = async (
  filename: string,
  content: string
): Promise<WebDAVSaveResult> => {
  if (!webdavClient) {
    return {
      success: false,
      error: 'WebDAV client not initialized',
    };
  }

  try {
    const targetPath = currentConfig?.path || '/';
    const filepath = targetPath === '/' ? filename : `${targetPath}/${filename}`;

    await webdavClient.putFileContents(filepath, content, {
      overwrite: true,
    });

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to save file',
    };
  }
};

export const deleteFile = async (
  filename: string
): Promise<WebDAVDeleteResult> => {
  if (!webdavClient) {
    return {
      success: false,
      error: 'WebDAV client not initialized',
    };
  }

  try {
    const targetPath = currentConfig?.path || '/';
    const filepath = targetPath === '/' ? filename : `${targetPath}/${filename}`;

    await webdavClient.deleteFile(filepath);

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete file',
    };
  }
};

export const createDirectory = async (
  directoryName: string
): Promise<WebDAVSaveResult> => {
  if (!webdavClient) {
    return {
      success: false,
      error: 'WebDAV client not initialized',
    };
  }

  try {
    const targetPath = currentConfig?.path || '/';
    const directoryPath =
      targetPath === '/' ? directoryName : `${targetPath}/${directoryName}`;

    await webdavClient.createDirectory(directoryPath);

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create directory',
    };
  }
};

export const fileExists = async (
  filename: string,
  path?: string
): Promise<boolean> => {
  if (!webdavClient) {
    return false;
  }

  try {
    const targetPath = path || currentConfig?.path || '/';
    const filepath = targetPath === '/' ? filename : `${targetPath}/${filename}`;
    return await webdavClient.exists(filepath);
  } catch (error) {
    return false;
  }
};