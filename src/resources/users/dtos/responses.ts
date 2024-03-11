import { UserModel } from '../models/user.model';

export type UserResponse = Omit<
  UserModel,
  'hashedPassword' | 'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
};
