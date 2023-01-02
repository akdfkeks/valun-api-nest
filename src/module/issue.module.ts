import { Module } from '@nestjs/common';
import { IssueController } from 'src/controller/issue.controller';
import IssueRepository from 'src/repository/issue.repository';
import { IssueService } from 'src/service/issue.service';
import { StorageService } from 'src/service/storage.service';

@Module({
  imports: [],
  controllers: [IssueController],
  providers: [IssueService, StorageService, IssueRepository],
})
export class IssueModule {}
