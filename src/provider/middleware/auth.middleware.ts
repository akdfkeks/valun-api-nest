import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/service/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  public async use(req: Request, res, next: () => void) {
    const token = await this.extractJwt(req);
    req.user = await this.authService.validateJwt(token);

    return next();
  }

  private async extractJwt(req) {
    try {
      const { authorization } = req.headers;
      return authorization.replace('Bearer ', '').replace('bearer ', '');
    } catch (e) {
      return null;
    }
  }
}
