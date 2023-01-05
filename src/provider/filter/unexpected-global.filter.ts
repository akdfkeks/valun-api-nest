import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class UnExpectedExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    // console.log(exception);

    const { message, name } = exception;
    const statusCode = 500;

    // const context = host.switchToHttp();
    const res = host.switchToHttp().getResponse<Response>();
    const error = {
      code: statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json({ message: 'Internal Server Error', error });
  }
}
