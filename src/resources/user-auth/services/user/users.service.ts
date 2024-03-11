import { UserMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/infra/drizzle/connection.service';
import { GetUserQuery } from '../../dtos/user-dtos/get-user.dto';
import { UserNotFoundException } from '../../exceptions/user-custom-exceptions';
import { UserModel } from '../../models/user/user.model';

@Injectable()
export class UsersService {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly userMapper: UserMapper,
  ) {}

  findUserById(id: number) {
    const db = this.connectionService.db;

    return db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });
  }

  findUserByEmail(email: string) {
    const db = this.connectionService.db;

    return db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
  }

  async findUser(userInput: GetUserQuery) {
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
}
