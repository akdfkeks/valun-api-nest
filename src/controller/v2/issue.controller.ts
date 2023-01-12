import { Controller, Get, Query } from '@nestjs/common';
import { GetIssuesQuery } from 'src/common/interface/v2/issue';
import { IssueService } from 'src/service/v2/issue.service';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  // * Web : 최근 제보된 이슈를 조회합니다.
  @Get('samples')
  async getSampleIssues(@Query() query: GetIssuesQuery) {
    return await this.issueService.findSampleIssues(query.categories);
  }
}
