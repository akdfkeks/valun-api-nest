import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from 'src/service/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  public async use(req: Request, res, next: NextFunction) {
    const token = this.extractJwtFromHeader(req.headers);
    req.user = await this.authService.validateJwt(token);

    return next();
  }

  private extractJwtFromHeader(headers: IncomingHttpHeaders) {
    try {
      const { authorization } = headers;
      return authorization.replace('Bearer ', '').replace('bearer ', '');
    } catch (e) {
      return null;
    }
  }
}
