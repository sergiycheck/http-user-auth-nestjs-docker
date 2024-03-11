import { authInfo } from 'src/infra/drizzle/schema';

export type AuthInfoModelInfed = typeof authInfo.$inferInsert;

export class AuthInfoModel implements AuthInfoModelInfed {
  userId: number;
  hashedAccessToken: string;
}
