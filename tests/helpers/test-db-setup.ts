/**
 * Test Database Setup Utilities
 * Handles creation, migration, and cleanup of test database
 */

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const TEST_DB_NAME = process.env.TEST_DB_NAME || 'notes_db_test';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

// Connection string to postgres database (for creating test DB)
const getAdminConnectionString = () =>
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/postgres`;

// Connection string to test database
export const getTestConnectionString = () =>
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${TEST_DB_NAME}`;

/**
 * Create test database if it doesn't exist
 */
export async function createTestDatabase(): Promise<void> {
  const adminClient = postgres(getAdminConnectionString(), { max: 1 });

  try {
    // Check if database exists
    const result = await adminClient`
      SELECT 1 FROM pg_database WHERE datname = ${TEST_DB_NAME}
    `;

    if (result.length === 0) {
      // Database doesn't exist, create it
      await adminClient.unsafe(`CREATE DATABASE ${TEST_DB_NAME}`);
      console.log(`Test database '${TEST_DB_NAME}' created`);
    } else {
      console.log(`Test database '${TEST_DB_NAME}' already exists`);
    }
  } catch (error) {
    console.error('Error creating test database:', error);
    throw error;
  } finally {
    await adminClient.end();
  }
}

/**
 * Drop test database
 */
export async function dropTestDatabase(): Promise<void> {
  const adminClient = postgres(getAdminConnectionString(), { max: 1 });

  try {
    // Terminate all connections to the test database
    await adminClient.unsafe(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${TEST_DB_NAME}' AND pid <> pg_backend_pid()
    `);

    // Drop the database
    await adminClient.unsafe(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`);
    console.log(`Test database '${TEST_DB_NAME}' dropped`);
  } catch (error) {
    console.error('Error dropping test database:', error);
    throw error;
  } finally {
    await adminClient.end();
  }
}

/**
 * Run migrations on test database
 */
export async function runTestMigrations(): Promise<void> {
  const migrationClient = postgres(getTestConnectionString(), { max: 1 });
  const db = drizzle(migrationClient);

  try {
    console.log('Running test database migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Test database migrations completed');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  } finally {
    await migrationClient.end();
  }
}

/**
 * Clean all tables in test database (for between tests)
 */
export async function cleanTestDatabase(client: postgres.Sql): Promise<void> {
  const db = drizzle(client);

  try {
    // Truncate all tables with CASCADE to handle foreign keys
    await db.execute(sql`TRUNCATE TABLE notes, users RESTART IDENTITY CASCADE`);
  } catch (error) {
    console.error('Error cleaning test database:', error);
    throw error;
  }
}

/**
 * Setup test database (create and migrate)
 */
export async function setupTestDatabase(): Promise<void> {
  await createTestDatabase();
  await runTestMigrations();
}

/**
 * Get test database client
 */
export function getTestDbClient(): postgres.Sql {
  return postgres(getTestConnectionString());
}
