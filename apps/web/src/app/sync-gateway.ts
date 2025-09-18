export type BoardState = {
  children: any[];
  viewport?: any;
  theme?: any;
  updatedAt: number;
};

export type ServerFileSummary = {
  name: string;
  size: number;
  updatedAt: number;
};

export type WebDavSettings = {
  url: string;
  username?: string;
  basePath: string;
  mainFile: string;
  timeout: number;
  label?: string;
  passwordSet?: boolean;
};

export type UpdateWebDavSettingsInput = {
  url: string;
  username?: string;
  password?: string;
  basePath: string;
  mainFile: string;
  timeout?: number;
  label?: string;
};

export type SyncStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export type GatewayConfig = {
  configured: boolean;
  label?: string;
};

export class SyncGatewayClient {
  private basePath: string;

  constructor(basePath: string = '/api') {
    this.basePath = basePath;
  }

  async getConfig(): Promise<GatewayConfig> {
    const response = await fetch(this.url('/config'));
    if (!response.ok) {
      return { configured: false };
    }
    return (await response.json()) as GatewayConfig;
  }

  async verifyPassword(password: string) {
    const response = await fetch(this.url('/auth/verify'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const body = await safeJson(response);
      const message = body?.message || 'INVALID_PASSWORD';
      throw new Error(message);
    }
    return (await response.json()) as { token: string; label?: string };
  }

  async validateToken(token: string) {
    const response = await fetch(this.url('/auth/session'), {
      headers: this.authHeader(token),
    });
    if (!response.ok) {
      throw new Error('UNAUTHORIZED');
    }
    return (await response.json()) as { ok: boolean; label?: string };
  }

  async getSettings(token: string) {
    const response = await fetch(this.url('/settings'), {
      headers: this.authHeader(token),
    });
    if (!response.ok) {
      throw new Error('SETTINGS_ERROR');
    }
    return (await response.json()) as WebDavSettings;
  }

  async updateSettings(token: string, settings: UpdateWebDavSettingsInput) {
    const payload: Record<string, unknown> = {
      url: settings.url,
      username: settings.username,
      basePath: settings.basePath,
      mainFile: settings.mainFile,
      timeout: settings.timeout,
      label: settings.label,
    };
    if (settings.password !== undefined && settings.password !== null) {
      payload.password = settings.password;
    }
    const response = await fetch(this.url('/settings'), {
      method: 'PUT',
      headers: {
        ...this.authHeader(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = await safeJson(response);
      const message = body?.message || 'SETTINGS_ERROR';
      throw new Error(message);
    }
    return (await response.json()) as WebDavSettings;
  }

  async loadBoard(token: string) {
    const response = await fetch(this.url('/board'), {
      headers: this.authHeader(token),
    });
    if (!response.ok) {
      throw new Error('connection-error');
    }
    const data = await response.json();
    return data.board as BoardState | null;
  }

  async saveBoard(token: string, board: BoardState) {
    const response = await fetch(this.url('/board'), {
      method: 'PUT',
      headers: {
        ...this.authHeader(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(board),
    });
    if (!response.ok) {
      throw new Error('upload-error');
    }
    return (await response.json()).board as BoardState;
  }

  async listFiles(token: string) {
    const response = await fetch(this.url('/files'), {
      headers: this.authHeader(token),
    });
    if (!response.ok) {
      throw new Error('list-error');
    }
    const data = await response.json();
    return (data.files || []) as ServerFileSummary[];
  }

  async downloadFile(token: string, name: string) {
    const response = await fetch(this.url(`/files/${encodeURIComponent(name)}`), {
      headers: this.authHeader(token),
    });
    if (!response.ok) {
      throw new Error('download-error');
    }
    return response.text();
  }

  async uploadFile(token: string, name: string, content: string) {
    const response = await fetch(this.url('/files'), {
      method: 'POST',
      headers: {
        ...this.authHeader(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, content }),
    });
    if (!response.ok) {
      throw new Error('upload-error');
    }
    return (await response.json()) as ServerFileSummary;
  }

  async renameFile(token: string, name: string, newName: string) {
    const response = await fetch(this.url(`/files/${encodeURIComponent(name)}`), {
      method: 'PUT',
      headers: {
        ...this.authHeader(token),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newName }),
    });
    if (!response.ok) {
      throw new Error('upload-error');
    }
    return (await response.json()) as ServerFileSummary;
  }

  async deleteFile(token: string, name: string) {
    const response = await fetch(this.url(`/files/${encodeURIComponent(name)}`), {
      method: 'DELETE',
      headers: this.authHeader(token),
    });
    if (!response.ok) {
      throw new Error('delete-error');
    }
  }

  private url(pathname: string) {
    return `${this.basePath}${pathname}`;
  }

  private authHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
