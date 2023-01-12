import { Module } from '@nestjs/common';
import { IssueController } from 'src/controller/v2/issue.controller';
import { IssueRepository } from 'src/repository/v2/issue.repository';
import { IssueService } from 'src/service/v2/issue.service';

@Module({
  imports: [],
  controllers: [IssueController],
  providers: [IssueService, IssueRepository],
  exports: [IssueService],
})
export class IssueModule {}
