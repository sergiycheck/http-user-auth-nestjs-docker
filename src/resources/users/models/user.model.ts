import { users } from 'src/infra/drizzle/schema';

export type UserModel = typeof users.$inferSelect;
