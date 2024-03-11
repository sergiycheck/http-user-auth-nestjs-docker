import {
  UserLoginResponse,
  UserLogoutResponse,
} from './../../users/dtos/responses.dto';
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Public } from '../utils/metadata.decorators';
import { RegisterUserDto } from '../../users/dtos/register.dto';
import { UsersService } from '../../users/services/users.service';
import { LoginUserDto } from '../../users/dtos/login.dto';
import { HttpUserExceptionFilter } from '../../users/filters/http-user-exceptions.filter';
import { LogoutUserDto } from '../../users/dtos/logout-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(HttpUserExceptionFilter)
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('sign-up')
  @ApiOkResponse({
    type: UserLoginResponse,
  })
  async registerUser(@Body() input: RegisterUserDto) {
    return this.usersService.registerUser(input);
  }

  @Public()
  @Post('sign-in')
  @ApiOkResponse({
    type: UserLoginResponse,
  })
  async loginUser(@Body() input: LoginUserDto) {
    return this.usersService.loginUser(input);
  }

  @ApiBearerAuth()
  @Post('sign-out')
  @ApiOkResponse({
    type: UserLogoutResponse,
  })
  async logoutUser(@Body() dto: LogoutUserDto) {
    return this.usersService.logoutUser(dto.id);
  }
}
