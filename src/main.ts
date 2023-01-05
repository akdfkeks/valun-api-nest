import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { HttpExceptionFilter } from './provider/filter/http-global.filter';
import { UnExpectedExceptionFilter } from './provider/filter/unexpected-global.filter';
import { ResponseInterceptor } from './provider/interceptor/response.interceptor';
import { winstonLogger } from './util/winston.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new UnExpectedExceptionFilter(), // second
    new HttpExceptionFilter(), // It works first
  );

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
