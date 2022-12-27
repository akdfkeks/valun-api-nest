import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ResponseInterceptor } from './provider/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
