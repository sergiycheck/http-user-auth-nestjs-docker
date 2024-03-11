import { users } from 'src/infra/drizzle/schema';

export type UserModelInfered = typeof users.$inferSelect;

export class UserModel implements UserModelInfered {
  id: number;
  email: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}
