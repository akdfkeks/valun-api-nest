import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class UnExpectedExceptionFilter implements ExceptionFilter {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }
  catch(exception: Error, host: ArgumentsHost) {
    const { message, name } = exception;
    const statusCode = 500;
    console.log(exception);
    this.logger.error(message);

    // const context = host.switchToHttp();
    const res = host.switchToHttp().getResponse<Response>();
    const error = {
      code: statusCode,
      name,
      timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json({ message: 'Internal Server Error', error });
  }
}
