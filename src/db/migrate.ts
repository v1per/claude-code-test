import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/notes_db';

async function runMigration() {
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  console.log('Running migrations...');

  await migrate(db, { migrationsFolder: './drizzle' });

  console.log('Migrations completed!');

  await migrationClient.end();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
});
