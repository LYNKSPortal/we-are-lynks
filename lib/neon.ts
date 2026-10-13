import { Pool, type QueryResultRow } from 'pg';

// Separate connection pool for the Neon-hosted admin auth database
// (password reset tokens, etc.) — kept independent from the main
// RDS-backed `sql` helper in lib/db.ts.
const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error('NEON_DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  max: 5,
  idleTimeoutMillis: 30000,
});

export async function neonSql<T extends QueryResultRow = any>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  let text = strings[0];
  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}` + strings[i + 1];
  }
  const result = await pool.query<T>(text, values as any[]);
  return result.rows;
}
