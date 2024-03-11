import { authInfo } from 'src/infra/drizzle/schema';

export type AuthInfoModel = typeof authInfo.$inferInsert;
