import {
  UserLoginResponse,
  UserLogoutResponse,
  UserResponse,
} from '../dtos/user-dtos/responses.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../utils/metadata.decorators';
import { RegisterUserDto } from '../dtos/user-dtos/register.dto';
import { UsersService } from '../services/user/users.service';
import { LoginUserDto } from '../dtos/user-dtos/login.dto';
import { HttpUserExceptionFilter } from '../filters/http-user-exceptions.filter';
import { LogoutUserDto } from '../dtos/user-dtos/logout-user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CacheRequestGetInterceptor } from 'src/resources/common/cache.interceptor';
import { GetUserQuery } from 'src/resources/user-auth/dtos/user-dtos/get-user.dto';
import { AuthService } from '../services/auth/auth.service';

@ApiTags('Users')
@Controller('users')
@UseFilters(HttpUserExceptionFilter)
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('sign-up')
  @ApiOkResponse({
    type: UserLoginResponse,
  })
  async registerUser(@Body() input: RegisterUserDto) {
    return this.authService.registerUser(input);
  }

  @Public()
  @Post('sign-in')
  @ApiOkResponse({
    type: UserLoginResponse,
  })
  async loginUser(@Body() input: LoginUserDto) {
    return this.authService.loginUser(input);
  }

  @ApiBearerAuth()
  @Post('sign-out')
  @ApiOkResponse({
    type: UserLogoutResponse,
  })
  async logoutUser(@Body() dto: LogoutUserDto) {
    return this.authService.removeAuthInfo({ userId: dto.id });
  }

  @Get('')
  @ApiBearerAuth()
  @UseInterceptors(CacheRequestGetInterceptor)
  @ApiOkResponse({
    type: UserResponse,
  })
  async getUser(@Query('id') id, @Query('email') email: string) {
    const dto = { id, email } as GetUserQuery;

    return this.usersService.findUser(dto);
  }
}
