-- NLP Group — D1 Database Schema
-- Run: wrangler d1 execute nlpgroup --remote --file=workers/api/db/schema.sql

-- ─── Projects ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            TEXT PRIMARY KEY,         -- 'PRJ-001'
  name          TEXT NOT NULL,
  client        TEXT NOT NULL,
  type          TEXT NOT NULL CHECK(type IN ('solar','ev')),
  power         INTEGER NOT NULL,         -- kWp / kW
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK(status IN ('pending','installing','active','completed')),
  contract_date TEXT,                     -- ISO date string
  value         INTEGER NOT NULL DEFAULT 0,  -- VND
  paid          INTEGER NOT NULL DEFAULT 0,  -- VND
  legal_status  TEXT NOT NULL DEFAULT 'pending'
                CHECK(legal_status IN ('pending','review','approved')),
  legal_note    TEXT,
  region        TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Invoices ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id          TEXT PRIMARY KEY,           -- 'INV-001'
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,           -- VND
  issued      TEXT NOT NULL,              -- ISO date
  due         TEXT NOT NULL,              -- ISO date
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK(status IN ('pending','paid','overdue')),
  type        TEXT NOT NULL DEFAULT 'full'
              CHECK(type IN ('full','deposit','progress','final')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Docs ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS docs (
  id          TEXT PRIMARY KEY,           -- 'DOC-001'
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,              -- 'Hợp đồng EPC', 'Giấy phép PCCC', ...
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK(status IN ('pending','draft','review','approved','signed','missing')),
  signed_date TEXT,                       -- ISO date or NULL
  expiry      TEXT,                       -- ISO date or NULL
  file_key    TEXT,                       -- R2 object key or NULL
  file_name   TEXT,                       -- original filename or NULL
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Users (for JWT auth) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email        TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'viewer'
               CHECK(role IN ('admin','finance','legal','viewer')),
  password_hash TEXT,                     -- bcrypt hash; NULL = SSO-only
  active       INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Refresh Tokens ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,        -- SHA-256 of raw token
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_invoices_project  ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status   ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_docs_project      ON docs(project_id);
CREATE INDEX IF NOT EXISTS idx_docs_status       ON docs(status);
CREATE INDEX IF NOT EXISTS idx_refresh_user      ON refresh_tokens(user_id);

-- ─── Trigger: auto-update updated_at ─────────────────────────────────────────
CREATE TRIGGER IF NOT EXISTS projects_updated AFTER UPDATE ON projects
  BEGIN UPDATE projects SET updated_at = datetime('now') WHERE id = NEW.id; END;
CREATE TRIGGER IF NOT EXISTS invoices_updated AFTER UPDATE ON invoices
  BEGIN UPDATE invoices SET updated_at = datetime('now') WHERE id = NEW.id; END;
CREATE TRIGGER IF NOT EXISTS docs_updated AFTER UPDATE ON docs
  BEGIN UPDATE docs SET updated_at = datetime('now') WHERE id = NEW.id; END;
