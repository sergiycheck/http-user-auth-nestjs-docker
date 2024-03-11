import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
import { Payload } from './guards-strategies/types';
import { CreateAuthInfo } from './dtos';
import { eq } from 'drizzle-orm';
import { authInfo } from 'src/infra/drizzle/schema';
import { ConnectionService } from 'src/infra/drizzle/connection.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private connectionService: ConnectionService,
  ) {}

  getSignedAccessToken(payload: Payload) {
    return this.jwtService.sign(payload);
  }

  findAuthInfoByUserId(userId: number) {
    const db = this.connectionService.db;

    return db.query.authInfo.findFirst({
      where: (authInfo, { eq }) => eq(authInfo.userId, userId),
    });
  }

  async createAuthInfo(dto: CreateAuthInfo) {
    const db = this.connectionService.db;

    const hashedAccessToken = await hash(dto.accessToken);

    const authInfoExists = await this.findAuthInfoByUserId(dto.userId);
    let res:
      | {
          id: number;
          userId: number;
          hashedAccessToken: string;
        }[]
      | undefined;

    if (!authInfoExists) {
      res = await db
        .insert(authInfo)
        .values({
          userId: dto.userId,
          hashedAccessToken,
        })
        .returning();
    } else {
      res = await db
        .update(authInfo)
        .set({
          hashedAccessToken,
        })
        .where(eq(authInfo.userId, dto.userId))
        .returning();
    }

    return res;
  }

  async removeAuthInfo({ userId }: { userId: number }) {
    const db = this.connectionService.db;

    await db.delete(authInfo).where(eq(authInfo.userId, userId));

    return { message: 'User was signed out!' };
  }
}
