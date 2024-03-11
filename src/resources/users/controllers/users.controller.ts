import { CacheRequestGetInterceptor } from '../../common/cache.interceptor';
import { GetUserQuery } from '../dtos/get-user.query';
import { HttpUserExceptionFilter } from '../filters/http-user-exceptions.filter';
import { UsersService } from '../services/users.service';
import {
  Controller,
  Get,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';

@Controller('users')
@UseFilters(HttpUserExceptionFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseInterceptors(CacheRequestGetInterceptor)
  async getUser(@Query('id') id, @Query('email') email: string) {
    const dto = { id, email } as GetUserQuery;
    const user = await this.usersService.findUser(dto);
    return user;
  }
}
