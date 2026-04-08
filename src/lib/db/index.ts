import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

let dbInstance: Database.Database | null = null;

function resolveDbPath(): string {
  const fromEnv = process.env.SQLITE_DB_PATH;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return resolve(process.cwd(), "data", "cogisoft.db");
}

const MIGRATIONS: ReadonlyArray<string> = [
  `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    name TEXT,
    message TEXT,
    experiment TEXT,
    meta TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_experiment ON leads(experiment)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)`,
];

function runMigrations(db: Database.Database): void {
  for (const sql of MIGRATIONS) {
    db.prepare(sql).run();
  }
}

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  const dbPath = resolveDbPath();
  mkdirSync(dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  runMigrations(db);

  dbInstance = db;
  return db;
}
