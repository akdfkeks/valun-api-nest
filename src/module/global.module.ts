import { Global, Module } from '@nestjs/common';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { PrismaService } from 'src/service/prisma.service';

@Global()
@Module({
  providers: [PrismaService, StrictJwtGuard],
  exports: [PrismaService, StrictJwtGuard],
})
export class GlobalModule {}
