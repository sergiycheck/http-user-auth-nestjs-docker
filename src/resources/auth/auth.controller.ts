import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { Public } from './metadata.decorators';
import { RegisterUserDto } from '../users/dtos/register.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dtos/login.dto';
import { HttpUserExceptionFilter } from '../users/filters/http-user-exceptions.filter';
import { LogoutUserDto } from '../users/dtos/logout-user.dto';

@Controller('auth')
@UseFilters(HttpUserExceptionFilter)
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('sign-up')
  async registerUser(@Body() input: RegisterUserDto) {
    return this.usersService.registerUser(input);
  }

  @Public()
  @Post('sign-in')
  async loginUser(@Body() input: LoginUserDto) {
    return this.usersService.loginUser(input);
  }

  @Post('sign-out')
  async logoutUser(@Body() dto: LogoutUserDto) {
    return this.usersService.logoutUser(dto.id);
  }
}
