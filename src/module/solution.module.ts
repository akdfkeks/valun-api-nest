import { Module } from '@nestjs/common';
import { SolutionController } from 'src/controller/solution.controller';
import { SolutionRepository } from 'src/repository/solution.repository';
import { IssueService } from 'src/service/issue.service';
import { SolutionService } from 'src/service/solution.service';
import { IssueModule } from './issue.module';

@Module({
  imports: [IssueModule],
  controllers: [SolutionController],
  providers: [SolutionService, SolutionRepository],
  exports: [SolutionService],
})
export class SolutionModule {}
