import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { AuthModule } from './auth.module';
import { PrismaModule } from './prisma.module';
import { UserModule } from './user.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
