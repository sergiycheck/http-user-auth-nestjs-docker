import {
  UserLoginResponse,
  UserMessageResponse,
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
import { CacheRequestGetInterceptor } from 'src/resources/common/interceptors/cache.interceptor';
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
  async registerUser(
    @Body() input: RegisterUserDto,
  ): Promise<UserLoginResponse> {
    return this.authService.registerUser(input);
  }

  @Public()
  @Post('sign-in')
  @ApiOkResponse({
    type: UserLoginResponse,
  })
  async loginUser(@Body() input: LoginUserDto): Promise<UserLoginResponse> {
    return this.authService.loginUser(input);
  }

  @ApiBearerAuth()
  @Post('sign-out')
  @ApiOkResponse({
    type: UserMessageResponse,
  })
  async logoutUser(@Body() dto: LogoutUserDto): Promise<UserMessageResponse> {
    return this.authService.removeAuthInfo(dto.id);
  }

  @Get()
  @ApiBearerAuth()
  @UseInterceptors(CacheRequestGetInterceptor)
  @ApiOkResponse({
    type: UserResponse,
  })
  async getUser(
    @Query('id') id?: number,
    @Query('email') email?: string,
  ): Promise<UserResponse> {
    const dto = { id, email } as GetUserQuery;
    return this.usersService.findUser(dto);
  }

  @ApiBearerAuth()
  @Post('remove')
  @ApiOkResponse({
    type: UserMessageResponse,
  })
  async removeUser(@Body() dto: LogoutUserDto): Promise<UserMessageResponse> {
    return this.usersService.deleteUserById(dto.id);
  }
}
