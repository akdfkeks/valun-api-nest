import { Module } from '@nestjs/common';
import { IssueController } from 'src/controller/issue.controller';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import IssueRepository from 'src/repository/issue.repository';
import { IssueService } from 'src/service/issue.service';
import { StorageService } from 'src/service/storage.service';

@Module({
  imports: [],
  controllers: [IssueController],
  providers: [IssueService, StorageService, IssueRepository, StrictJwtGuard],
})
export class IssueModule {}
