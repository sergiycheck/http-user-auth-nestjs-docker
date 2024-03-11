import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserMapper } from './services/user.mapper';
import { DrizzleModule } from 'src/infra/drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DrizzleModule, forwardRef(() => AuthModule)],
  providers: [UsersService, UserMapper],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
