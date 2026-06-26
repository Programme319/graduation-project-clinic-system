import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

async function runMigrations() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    console.log('Running migrations...');
    
    // Check if migrations directory exists
    const migrationsPath = path.join(process.cwd(), 'drizzle');
    if (!fs.existsSync(migrationsPath)) {
      console.log('No migrations directory found. Skipping migrations.');
      await pool.end();
      return;
    }

    await migrate(db, { migrationsFolder: migrationsPath });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigrations();
