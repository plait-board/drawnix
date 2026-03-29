import { PlaitBoard, PlaitElement, PlaitTheme, Viewport } from '@plait/core';
import { isValidDrawnixData, DrawnixExportedData } from './json';
import { loadFile, listFiles, testConnection, createWebDAVClient } from './webdav';
import { WebDAVConfig } from './webdav-types';

export const loadFromWebDAV = async (
  config: WebDAVConfig,
  filename: string
): Promise<DrawnixExportedData | null> => {
  try {
    const testResult = await testConnection(config);
    if (!testResult.success) {
      throw new Error(testResult.error);
    }

    createWebDAVClient(config);
    const result = await loadFile(filename);
    
    if (!result.success || !result.data) {
      if (result.error) {
        throw new Error(result.error);
      }
      throw new Error('Failed to load file from WebDAV');
    }

    const data = JSON.parse(result.data);
    
    if (!isValidDrawnixData(data)) {
      throw new Error('Invalid Drawnix file format');
    }

    return data;
  } catch (error: any) {
    throw error;
  }
};

export const browseWebDAVFiles = async (config: WebDAVConfig) => {
  try {
    const testResult = await testConnection(config);
    if (!testResult.success) {
      throw new Error(testResult.error);
    }

    createWebDAVClient(config);
    const result = await listFiles(config.path);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to list files');
    }

    // Filter for drawnix files
    const drawnixFiles = result.files.filter(file => 
      file.filename.endsWith('.drawnix') || file.filename.endsWith('.json')
    );

    return drawnixFiles;
  } catch (error: any) {
    throw error;
  }
};