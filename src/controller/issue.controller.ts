import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateIssueDto } from 'src/dto/issue.dto';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { IssueService } from 'src/service/issue.service';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @UseGuards(StrictJwtGuard)
  @Post('')
  async postIssue(@Req() req: Request, @Body() issue: CreateIssueDto) {
    const created = await this.issueService.createIssue(req.user, issue);
    return {
      message: '이슈를 등록하였습니다.',
      data: {},
    };
  }

  @UseGuards(StrictJwtGuard)
  @Get(':id')
  async getIssue(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: Request,
  ) {
    const issue = await this.issueService.findIssueById(req.user, id);
    return {
      message: `Issue with ID of ${id}`,
      data: issue,
    };
  }
}
