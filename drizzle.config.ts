import { defineConfig } from 'drizzle-kit';
import { env } from 'process';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});


