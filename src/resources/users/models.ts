import { users, authInfo } from 'src/infra/drizzle/schema';

export type UserModel = typeof users.$inferSelect;
export type AuthInfoModel = typeof authInfo.$inferInsert;
