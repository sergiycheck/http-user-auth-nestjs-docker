import { UserModel } from '../models';

export type UserResponse = Omit<
  UserModel,
  'hashedPassword' | 'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
};
