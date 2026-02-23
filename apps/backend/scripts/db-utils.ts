import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import oracledb from 'oracledb';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

type SqlFile = {
  filename: string;
  absolutePath: string;
  version: string;
};

export async function createConnection(): Promise<oracledb.Connection> {
  const user = requiredEnv('ORACLE_USER');
  const password = requiredEnv('ORACLE_PASSWORD');
  const connectString = requiredEnv('ORACLE_CONNECT_STRING');

  return oracledb.getConnection({
    user,
    password,
    connectString,
  });
}

export function listSqlFiles(directory: string, prefixPattern: RegExp): SqlFile[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => prefixPattern.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((filename) => {
      const version = filename.split('__')[0];
      return {
        filename,
        absolutePath: path.join(directory, filename),
        version,
      };
    });
}

export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  const lines = sql.split(/\r?\n/);

  let current: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) {
      continue;
    }

    current.push(line);
    if (trimmed.endsWith(';')) {
      const statement = current.join('\n').trim();
      if (statement.length > 0) {
        statements.push(statement.replace(/;\s*$/, ''));
      }
      current = [];
    }
  }

  const trailing = current.join('\n').trim();
  if (trailing) {
    statements.push(trailing);
  }

  return statements;
}

export async function ensureMigrationsTable(connection: oracledb.Connection) {
  try {
    await connection.execute(`
      CREATE TABLE schema_migrations (
        version      VARCHAR2(50) PRIMARY KEY,
        filename     VARCHAR2(255) NOT NULL,
        applied_at   TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
      )
    `);
    await connection.commit();
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'errorNum' in error &&
      (error as { errorNum?: number }).errorNum === 955
    ) {
      return;
    }
    throw error;
  }
}

export async function getAppliedVersions(
  connection: oracledb.Connection,
): Promise<Set<string>> {
  const result = await connection.execute<{ VERSION: string }>(
    `SELECT version FROM schema_migrations`,
    {},
    { outFormat: oracledb.OUT_FORMAT_OBJECT },
  );

  const versions = new Set<string>();
  for (const row of result.rows ?? []) {
    versions.add(String(row.VERSION));
  }
  return versions;
}

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}
