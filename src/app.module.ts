import { Module } from '@nestjs/common';
import { UsersAuthModule } from './resources/user-auth/user-auth.module';
import { DrizzleModule } from './infra/drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    DrizzleModule,
    UsersAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
