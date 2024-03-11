import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../utils/constants';
import { Strategies } from './types';

@Injectable()
export class JwtAuthGuard extends AuthGuard(Strategies.JWT) {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const superCanActivateRes = (await super.canActivate(
      context,
    )) as unknown as Promise<boolean>;

    return superCanActivateRes;
  }

  getRequest(ctx: ExecutionContext) {
    return ctx.switchToHttp().getRequest();
  }
}
