import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthGuard } from './guards-strategies/jwt-auth.guard';

import { AuthService } from './services/auth.service';

import { JwtStrategy } from './guards-strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { DrizzleModule } from 'src/infra/drizzle/drizzle.module';
import { AuthController } from './controllers/auth.controller';

@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    DrizzleModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRES_SECONDS')}s`,
        },
        secret: configService.get<string>('PRIVATE_JWT_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // provide JWT guard globally
    { provide: APP_GUARD, useExisting: JwtAuthGuard },
    JwtAuthGuard,
  ],

  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
