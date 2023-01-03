import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class StrictJwtGuard implements CanActivate {
  private anonymous: boolean;
  constructor(
    private readonly reflector: Reflector,
    options: { anonymous?: boolean },
  ) {
    this.anonymous = options.anonymous;
  }

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException('권한이 없습니다');
    return true;
  }
}
