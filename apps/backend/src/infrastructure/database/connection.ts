/**
 * Database Connection
 * Infrastructure concern - manages database connectivity
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/notes_db';

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance with schema
export const db = drizzle(client, { schema });

export type Database = typeof db;
