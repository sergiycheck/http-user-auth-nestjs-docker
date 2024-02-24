import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infra/drizzle/schema.ts',
  out: './drizzle',
} satisfies Config;
