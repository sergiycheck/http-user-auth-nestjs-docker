import { UserMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/infra/drizzle/connection.service';
import { GetUserQuery } from '../../dtos/user-dtos/get-user.dto';
import { UserNotFoundException } from '../../exceptions/user-custom-exceptions';
import { UserModel } from '../../models/user/user.model';
import { users } from 'src/infra/drizzle/schema';
import { eq } from 'drizzle-orm';
import { LRUCacheInstance } from 'src/infra/cache/lru.cache';
import {
  UserMessageResponse,
  UserResponse,
} from '../../dtos/user-dtos/responses.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly userMapper: UserMapper,
  ) {}

  findUserById(id: number): Promise<UserModel | null> {
    const db = this.connectionService.db;

    return db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });
  }

  findUserByEmail(email: string): Promise<UserModel | null> {
    const db = this.connectionService.db;

    return db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
  }

  async findUser(userInput: GetUserQuery): Promise<UserResponse> {
    let user: UserModel;

    if (userInput?.id) {
      user = await this.findUserById(userInput.id);
    } else if (userInput?.email) {
      user = await this.findUserByEmail(userInput.email);
    }

    if (!user) {
      throw new UserNotFoundException(`User not found`);
    }

    return this.userMapper.toUserResponse(user);
  }

  async deleteUserById(id: number): Promise<UserMessageResponse> {
    const db = this.connectionService.db;

    const resultArr = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!resultArr.length) {
      throw new UserNotFoundException(`User not found`);
    } else {
      const deletedUser = resultArr[0];

      LRUCacheInstance.delete(`/users?id=${id}`);
      LRUCacheInstance.delete(`/users?email=${deletedUser.email}`);
    }

    return { message: 'User deleted' };
  }
}
