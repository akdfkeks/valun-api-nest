import { Module } from '@nestjs/common';
import { IssueController } from 'src/controller/issue.controller';
import IssueRepository from 'src/repository/issue.repository';
import { IssueService } from 'src/service/issue.service';

@Module({
  imports: [],
  controllers: [IssueController],
  providers: [IssueService, IssueRepository],
  exports: [IssueService, IssueRepository],
})
export class IssueModule {}
