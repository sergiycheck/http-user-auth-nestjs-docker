import { Module } from '@nestjs/common';
import { UsersAuthModule } from './resources/user-auth/user-auth.module';
import { DrizzleModule } from './infra/drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),

        PORT: Joi.number().default(3000),
        // pg related
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_URL: Joi.string().required(),
        // auth related
        PRIVATE_JWT_KEY: Joi.string().required(),
        JWT_EXPIRES_SECONDS: Joi.string().required(),
      }),
    }),

    DrizzleModule,
    UsersAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
