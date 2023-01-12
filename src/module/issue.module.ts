import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { IssueController } from 'src/controller/issue.controller';
import IssueRepository from 'src/repository/issue.repository';
import { IssueService } from 'src/service/issue.service';
import { IssueModule as IssueModuleV2 } from './v2/issue.module';

@Module({
  imports: [
    IssueModuleV2,
    RouterModule.register([
      {
        path: 'v2',
        module: IssueModuleV2,
      },
    ]),
  ],
  controllers: [IssueController],
  providers: [IssueService, IssueRepository],
  exports: [IssueService, IssueRepository],
})
export class IssueModule {}
