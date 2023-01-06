import { Global, Module } from '@nestjs/common';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { PrismaService } from 'src/service/prisma.service';
import { StorageService } from 'src/service/storage.service';

@Global()
@Module({
  providers: [PrismaService, StrictJwtGuard, StorageService],
  exports: [PrismaService, StrictJwtGuard, StorageService],
})
export class GlobalModule {}
