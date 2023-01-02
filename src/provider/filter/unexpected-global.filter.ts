import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class UnExpectedExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const { message, name } = exception;
    const statusCode = 500;

    // const context = host.switchToHttp();
    const res = host.switchToHttp().getResponse<Response>();
    const data = { error: name, timestamp: new Date().toISOString() };

    res
      .status(statusCode)
      .json({ statusCode, message: 'Internal Server Error', data });
  }
}
