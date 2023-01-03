import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { HttpExceptionFilter } from './provider/filter/http-global.filter';
import { UnExpectedExceptionFilter } from './provider/filter/unexpected-global.filter';
import { ResponseInterceptor } from './provider/interceptor/response.interceptor';

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

  await app.listen(3000);
}
bootstrap();
