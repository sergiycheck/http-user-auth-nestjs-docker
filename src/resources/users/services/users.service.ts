import { UserMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { ConnectionService } from 'src/infra/drizzle/connection.service';
import { AuthService } from '../../auth/services/auth.service';
import { GetUserQuery } from '../dtos/get-user.dto';
import { RegisterUserDto } from '../dtos/register.dto';
import { users } from 'src/infra/drizzle/schema';
import { LoginUserDto } from '../dtos/login.dto';
import {
  SignInBadRequestException,
  UserBadRequestException,
  UserNotFoundException,
} from '../exceptions/user-custom-exceptions';
import { UserModel } from '../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly userMapper: UserMapper,
    private readonly authService: AuthService,
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
    } else {
      throw new UserNotFoundException(`User not found`);
    }

    const result = user ? this.userMapper.toUserResponse(user) : null;

    return result;
  }

  async registerUser(userInput: RegisterUserDto) {
    const db = this.connectionService.db;

    if (userInput.password !== userInput.repeatPassword) {
      throw new UserBadRequestException(`Passwords do not match`);
    }

    const userExists = await this.findUser({ email: userInput.email });
    if (userExists) {
      throw new UserBadRequestException(
        `User with email ${userInput.email} already exists`,
      );
    }

    const hashedPassword = await hash(userInput.password);

    const [user] = await db
      .insert(users)
      .values({
        email: userInput.email,
        hashedPassword,
      })
      .returning();

    const accessToken = this.authService.getSignedAccessToken({
      email: user.email,
    });

    await this.authService.createAuthInfo({
      accessToken,
      userId: user.id,
    });

    return this.userMapper.toUserLoginResponse(user, accessToken);
  }

  async loginUser(userInput: LoginUserDto) {
    const db = this.connectionService.db;

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, userInput.email),
    });

    if (!user) {
      throw new UserNotFoundException(
        `User with email ${userInput.email} not found`,
      );
    }

    const isPasswordValid = await verify(
      user.hashedPassword,
      userInput.password,
    );

    if (!isPasswordValid) {
      throw new SignInBadRequestException(`Password is invalid`);
    }

    const accessToken = this.authService.getSignedAccessToken({
      email: user.email,
    });

    await this.authService.createAuthInfo({
      accessToken,
      userId: user.id,
    });

    return this.userMapper.toUserLoginResponse(user, accessToken);
  }

  async logoutUser(userId: number) {
    return this.authService.removeAuthInfo({ userId });
  }
}
