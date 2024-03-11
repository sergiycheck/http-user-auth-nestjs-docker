import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Payload, Strategies } from './types';
import { UsersService } from 'src/resources/users/services/users.service';
import { UserResponse } from 'src/resources/users/dtos/responses.dto';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, Strategies.JWT) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const configObj: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('PRIVATE_JWT_KEY'),
      passReqToCallback: true,
    };
    super(configObj);
  }

  async validate(req: Request, payload: Payload): Promise<UserResponse> {
    if (!payload || !payload.email)
      throw new BadRequestException(`Jwt token validation failed!`);

    const user = await this.usersService.findUser({
      email: payload.email,
    });

    if (!user) {
      throw new BadRequestException(
        `User with address ${user.email} was not found!`,
      );
    }

    const authInfo = await this.authService.findAuthInfoByUserId(user.id);

    if (!authInfo) {
      throw new BadRequestException(`User was signed out!`);
    }

    return user;
  }
}
