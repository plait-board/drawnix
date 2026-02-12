import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function initializeDatabase(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (db) return db;

  const dbPath = path.join(__dirname, '../../data/drawnix.db');

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await db.run('PRAGMA foreign_keys = ON');

  // Create tables
  await createTables();

  // Seed initial data
  await seedData();

  return db;
}

async function createTables() {
  if (!db) throw new Error('Database not initialized');

  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Boards table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS boards (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      elements TEXT DEFAULT '[]',
      viewport TEXT DEFAULT '{"zoom":1,"scrollX":0,"scrollY":0}',
      theme TEXT DEFAULT 'default',
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Attachments table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      board_id TEXT NOT NULL,
      name TEXT NOT NULL,
      size INTEGER NOT NULL,
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      background_color TEXT DEFAULT '#f0f9ff',
      upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
    )
  `);

  // Indexes
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_boards_owner ON boards(owner_id)'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_boards_status ON boards(status)'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_attachments_board ON attachments(board_id)'
  );
}

async function seedData() {
  if (!db) throw new Error('Database not initialized');

  // Check if we already have users
  const count = await db.get('SELECT COUNT(*) as count FROM users');
  if (count.count > 0) return;

  const bcrypt = require('bcryptjs');

  // Create default users
  const users = [
    {
      id: 'user-001',
      username: '123',
      password: await bcrypt.hash('123', 10),
      role: 'admin',
    },
    {
      id: 'user-002',
      username: 'user',
      password: await bcrypt.hash('user', 10),
      role: 'user',
    },
    {
      id: 'user-003',
      username: 'demo',
      password: await bcrypt.hash('demo', 10),
      role: 'user',
    },
  ];

  for (const user of users) {
    await db.run(
      'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
      [user.id, user.username, user.password, user.role]
    );
  }

  console.log('✅ Seed data created');
}

export function getDatabase(): Database<sqlite3.Database, sqlite3.Statement> {
  if (!db)
    throw new Error(
      'Database not initialized. Call initializeDatabase() first.'
    );
  return db;
}
