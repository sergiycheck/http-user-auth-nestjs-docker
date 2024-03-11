import { OmitType } from '@nestjs/swagger';
import { UserModel } from '../../models/user/user.model';

export class UserResponse extends OmitType(UserModel, [
  'hashedPassword',
  'createdAt',
  'updatedAt',
] as const) {
  createdAt: string;
  updatedAt: string;
}

export class UserLoginResponse {
  user: UserResponse;
  authInfo: { accessToken: string };
}

export class UserMessageResponse {
  message: string;
}
