import { Injectable } from '@nestjs/common';
import { UserModel } from '../../models/user/user.model';
import {
  UserLoginResponse,
  UserResponse,
} from '../../dtos/user-dtos/responses.dto';

@Injectable()
export class UserMapper {
  toUserResponse(user: UserModel): UserResponse {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    };
  }

  toUserLoginResponse(user: UserModel, accessToken: string): UserLoginResponse {
    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      },
      authInfo: {
        accessToken,
      },
    };
  }
}
