CREATE TABLE IF NOT EXISTS drawings (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL,
  edit_token_hash TEXT NOT NULL,
  title TEXT,
  size_bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_drawings_updated_at ON drawings(updated_at);

