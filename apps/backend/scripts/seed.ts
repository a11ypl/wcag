import * as fs from 'fs';
import * as path from 'path';
import { createConnection, listSqlFiles, splitSqlStatements } from './db-utils';

async function main() {
  const seedsDir = path.resolve(__dirname, '../../../db/seeds');
  const connection = await createConnection();

  try {
    const files = listSqlFiles(seedsDir, /^S\d+__.*\.sql$/);

    for (const file of files) {
      const sql = fs.readFileSync(file.absolutePath, 'utf-8');
      const statements = splitSqlStatements(sql);

      // eslint-disable-next-line no-console
      console.log(`seed ${file.filename} (${statements.length} statements)`);

      for (const statement of statements) {
        await connection.execute(statement);
      }

      await connection.commit();
    }

    // eslint-disable-next-line no-console
    console.log('seed complete');
  } finally {
    await connection.close();
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
