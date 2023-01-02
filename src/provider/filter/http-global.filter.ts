import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const { message, name } = exception;
    const statusCode = exception.getStatus();

    // const context = host.switchToHttp();
    const res = host.switchToHttp().getResponse<Response>();
    const data = { error: name, timestamp: new Date().toISOString() };

    res.status(statusCode).json({ statusCode, message, data });
  }
}
