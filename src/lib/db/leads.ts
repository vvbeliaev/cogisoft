import { getDb } from "./index";

export interface LeadInput {
  email: string;
  name?: string | null;
  message?: string | null;
  experiment?: string | null;
  meta?: unknown;
}

export interface LeadRecord {
  id: number;
  email: string;
  name: string | null;
  message: string | null;
  experiment: string | null;
  meta: unknown;
  created_at: string;
  updated_at: string;
}

interface LeadRow {
  id: number;
  email: string;
  name: string | null;
  message: string | null;
  experiment: string | null;
  meta: string | null;
  created_at: string;
  updated_at: string;
}

function rowToRecord(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    message: row.message,
    experiment: row.experiment,
    meta: row.meta == null ? null : safeParseJson(row.meta),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function createLead(input: LeadInput): number {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO leads (email, name, message, experiment, meta)
     VALUES (@email, @name, @message, @experiment, @meta)`,
  );

  const result = stmt.run({
    email: input.email,
    name: input.name ?? null,
    message: input.message ?? null,
    experiment: input.experiment ?? null,
    meta: input.meta == null ? null : JSON.stringify(input.meta),
  });

  return Number(result.lastInsertRowid);
}

export function listLeads(limit = 100): LeadRecord[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, email, name, message, experiment, meta, created_at, updated_at
       FROM leads
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .all(limit) as LeadRow[];

  return rows.map(rowToRecord);
}
