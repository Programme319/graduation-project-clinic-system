import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from './db/client';
import * as schema from './db/schema';

let auth: any = null;

export function getAuth() {
  if (!auth) {
    if (!process.env.BETTER_AUTH_SECRET) {
      throw new Error('BETTER_AUTH_SECRET environment variable is not set');
    }

    const db = getDb();

    auth = betterAuth({
      database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
      }),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
    });
  }
  return auth;
}
