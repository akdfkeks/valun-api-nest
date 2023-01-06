import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { Logger } from '@nestjs/common';

@Injectable()
export class RequestLogger implements NestMiddleware {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  use(req: Request, res: any, next: NextFunction) {
    this.logger.log(`${req.method} ${req.originalUrl} ${req.ip}`);
    return next();
  }
}
