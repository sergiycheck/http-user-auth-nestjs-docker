import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserMapper } from './user.mapper';
import { DrizzleModule } from 'src/infra/drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DrizzleModule, forwardRef(() => AuthModule)],
  providers: [UsersService, UserMapper],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
