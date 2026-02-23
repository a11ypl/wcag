import * as fs from 'fs';
import * as path from 'path';
import {
  createConnection,
  ensureMigrationsTable,
  getAppliedVersions,
  listSqlFiles,
  splitSqlStatements,
} from './db-utils';

async function main() {
  const migrationsDir = path.resolve(__dirname, '../../../db/migrations');
  const connection = await createConnection();

  try {
    await ensureMigrationsTable(connection);
    const applied = await getAppliedVersions(connection);
    const files = listSqlFiles(migrationsDir, /^V\d+__.*\.sql$/);

    for (const file of files) {
      if (applied.has(file.version)) {
        // eslint-disable-next-line no-console
        console.log(`skip ${file.filename}`);
        continue;
      }

      const sql = fs.readFileSync(file.absolutePath, 'utf-8');
      const statements = splitSqlStatements(sql);

      // eslint-disable-next-line no-console
      console.log(`apply ${file.filename} (${statements.length} statements)`);

      for (const statement of statements) {
        await connection.execute(statement);
      }

      await connection.execute(
        `
        INSERT INTO schema_migrations (version, filename)
        VALUES (:version, :filename)
        `,
        {
          version: file.version,
          filename: file.filename,
        },
      );

      await connection.commit();
    }

    // eslint-disable-next-line no-console
    console.log('migrations complete');
  } finally {
    await connection.close();
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
