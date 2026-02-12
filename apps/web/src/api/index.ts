// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('[API] Base URL:', API_BASE_URL);

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
  avatar?: string;
  created_at?: string;
}

export interface Board {
  id: string;
  owner_id: string;
  owner_name?: string;
  title: string;
  elements: any[];
  viewport: { zoom: number; scrollX: number; scrollY: number };
  theme: string;
  status: 'draft' | 'published';
  last_modified: number;
  created_at?: string;
}

export interface Attachment {
  id: string;
  board_id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  background_color: string;
  upload_time: string;
}

// Token management
const TOKEN_KEY = 'drawnix_token';
const USER_KEY = 'drawnix_user';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token);
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};
export const setStoredUser = (user: User): void =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeStoredUser = (): void => localStorage.removeItem(USER_KEY);

// Raw fetch function with explicit headers
async function apiFetch<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    if (body instanceof FormData) {
      // FormData - don't set Content-Type, browser will set it with boundary
      config.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  console.log(`[API] ${method} ${url}`, { headers, body });

  try {
    const response = await fetch(url, config);

    console.log('[API] Response status:', response.status);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[API] Non-JSON response:', text.substring(0, 200));
      throw new Error(
        'Server returned non-JSON response. Possible browser extension interference.'
      );
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        removeStoredUser();
        window.location.href = '/login';
      }
      throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('[API] Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error');
  }
}

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<{ user: User; token: string }>('/auth/login', 'POST', {
      username,
      password,
    }),

  register: (username: string, password: string) =>
    apiFetch<{ user: User; token: string }>('/auth/register', 'POST', {
      username,
      password,
    }),

  getCurrentUser: () => apiFetch<{ user: User }>('/auth/me'),
};

// Boards API
export const boardsApi = {
  getAll: () =>
    apiFetch<{ myBoards: Board[]; publishedBoards: Board[] }>('/boards'),

  getById: (id: string) =>
    apiFetch<{ board: Board; attachments: Attachment[] }>(`/boards/${id}`),

  create: (title: string) =>
    apiFetch<{ board: Board }>('/boards', 'POST', { title }),

  update: (id: string, data: Partial<Board>) =>
    apiFetch<{ board: Board }>(`/boards/${id}`, 'PUT', data),

  delete: (id: string) => apiFetch(`/boards/${id}`, 'DELETE'),
};

// Attachments API
export const attachmentsApi = {
  getByBoardId: (boardId: string) =>
    apiFetch<{ attachments: Attachment[] }>(`/attachments/board/${boardId}`),

  upload: (boardId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch<{ attachment: Attachment }>(
      `/attachments/board/${boardId}`,
      'POST',
      formData
    );
  },

  updateColor: (id: string, backgroundColor: string) =>
    apiFetch<{ attachment: Attachment }>(`/attachments/${id}/color`, 'PUT', {
      backgroundColor,
    }),

  delete: (id: string) => apiFetch(`/attachments/${id}`, 'DELETE'),
};

// Admin API
export const adminApi = {
  getStats: () =>
    apiFetch<{
      users: number;
      boards: number;
      publishedBoards: number;
      attachments: number;
    }>('/admin/stats'),

  getUsers: () =>
    apiFetch<{ users: (User & { board_count: number })[] }>('/admin/users'),

  getBoards: () => apiFetch<{ boards: Board[] }>('/admin/boards'),

  deleteBoard: (id: string) => apiFetch(`/admin/boards/${id}`, 'DELETE'),

  updateUserRole: (id: string, role: 'user' | 'admin') =>
    apiFetch<{ user: User }>(`/admin/users/${id}/role`, 'PUT', { role }),
};
