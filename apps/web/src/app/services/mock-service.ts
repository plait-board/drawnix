import { PlaitElement, Viewport, ThemeColorMode } from '@plait/core';

// Define types
export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'user' | 'admin'; // Simple role for now
}

export interface BoardData {
  id: string;
  ownerId: string;
  title: string;
  elements: PlaitElement[];
  viewport: Viewport;
  theme: ThemeColorMode;
  status: 'draft' | 'published';
  lastModified: number;
}

// Mock Storage Service
export class MockStorageService {
  private static STORAGE_KEY_BOARDS = 'drawnix_boards';
  private static STORAGE_KEY_USERS = 'drawnix_users';

  // Initialize with some dummy data if empty
  static init() {
    if (!localStorage.getItem(this.STORAGE_KEY_USERS)) {
      const users: User[] = [
        { id: 'user-a', username: '123', password: '123', role: 'user' },
        { id: 'user-b', username: 'userb', password: 'password123', role: 'user' },
      ];
      localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    }
    // We don't init boards, start fresh
  }

  static getBoards(userId?: string): BoardData[] {
    const boardsJson = localStorage.getItem(this.STORAGE_KEY_BOARDS);
    const boards: BoardData[] = boardsJson ? JSON.parse(boardsJson) : [];
    if (userId) {
      return boards.filter(b => b.ownerId === userId);
    }
    return boards;
  }
  
  static getPublishedBoards(): BoardData[] {
     const boardsJson = localStorage.getItem(this.STORAGE_KEY_BOARDS);
     const boards: BoardData[] = boardsJson ? JSON.parse(boardsJson) : [];
     return boards.filter(b => b.status === 'published');
  }

  static getBoard(boardId: string): BoardData | undefined {
    const boards = this.getBoards();
    return boards.find(b => b.id === boardId);
  }

  static saveBoard(board: BoardData): void {
    const boards = this.getBoards();
    const index = boards.findIndex(b => b.id === board.id);
    if (index >= 0) {
      boards[index] = board;
    } else {
      boards.push(board);
    }
    localStorage.setItem(this.STORAGE_KEY_BOARDS, JSON.stringify(boards));
  }
  
  static createBoard(ownerId: string, title: string): BoardData {
      const newBoard: BoardData = {
          id: crypto.randomUUID(),
          ownerId,
          title,
          elements: [],
          viewport: { zoom: 1, scrollX: 0, scrollY: 0 },
          theme: 'default' as ThemeColorMode,
          status: 'draft',
          lastModified: Date.now()
      };
      this.saveBoard(newBoard);
      return newBoard;
  }
}

// Mock Auth Service
export class MockAuthService {
  private static CURRENT_USER_KEY = 'drawnix_current_user';

  static login(username: string, password?: string): User | null {
    const usersJson = localStorage.getItem(MockStorageService['STORAGE_KEY_USERS']); // Accessing private via string key for simplicity in this mock file, or public static
    // Re-implementing simple lookup since users are static in init
    const users: User[] = usersJson ? JSON.parse(usersJson) : [
        { id: 'user-a', username: '123', password: '123', role: 'user' },
        { id: 'user-b', username: 'userb', password: 'password123', role: 'user' },
    ];
    
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  }

  static logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}

// Initialize on load
MockStorageService.init();
