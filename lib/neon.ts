import { Pool, type QueryResultRow } from 'pg';

// Separate connection pool for the Neon-hosted admin auth database
// (password reset tokens, etc.) — kept independent from the main
// RDS-backed `sql` helper in lib/db.ts.
//
// The pool is created lazily (on first query) rather than at module
// load time, so importing this module doesn't throw during Next.js's
// build-time page data collection in environments where the env var
// isn't set (e.g. a preview deployment without it configured yet).
let pool: Pool | null = null;

function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error('NEON_DATABASE_URL environment variable is not set');
  }

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
    max: 5,
    idleTimeoutMillis: 30000,
  });
  return pool;
}

export async function neonSql<T extends QueryResultRow = any>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  let text = strings[0];
  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}` + strings[i + 1];
  }
  const result = await getPool().query<T>(text, values as any[]);
  return result.rows;
}
