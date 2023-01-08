import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const { message, name } = exception;
    const statusCode = exception.getStatus();
    console.log(exception);
    this.logger.error(message, name);

    // const context = host.switchToHttp();
    const res = host.switchToHttp().getResponse<Response>();
    const error = {
      code: statusCode,
      message: name,
      timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json({ message, error });
  }
}
