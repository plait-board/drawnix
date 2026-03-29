export interface WebDAVConfig {
  url: string;
  username?: string;
  password?: string;
  path?: string;
}

export interface WebDAVFile {
  filename: string;
  size: number;
  lastmodified: Date;
  type: string;
  href: string;
  depth: number;
  etag?: string;
  status?: number;
  props?: Record<string, any>;
}

export interface WebDAVClientConfig extends Partial<WebDAVConfig> {
  serverUrl?: string;
}

export interface WebDAVListResult {
  success: boolean;
  files: WebDAVFile[];
  error?: string;
}

export interface WebDAVLoadResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface WebDAVSaveResult {
  success: boolean;
  error?: string;
}

export interface WebDAVDeleteResult {
  success: boolean;
  error?: string;
}

export interface WebDAVTestConnectionResult {
  success: boolean;
  message?: string;
  error?: string;
}