import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CacheRequestGetInterceptor } from '../../common/cache.interceptor';
import { GetUserQuery } from '../dtos/get-user.dto';
import { HttpUserExceptionFilter } from '../filters/http-user-exceptions.filter';
import { UsersService } from '../services/users.service';
import {
  Controller,
  Get,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { UserResponse } from '../dtos/responses.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseFilters(HttpUserExceptionFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseInterceptors(CacheRequestGetInterceptor)
  @ApiOkResponse({
    type: UserResponse,
  })
  async getUser(@Query('id') id, @Query('email') email: string) {
    const dto = { id, email } as GetUserQuery;
    const user = await this.usersService.findUser(dto);
    return user;
  }
}
