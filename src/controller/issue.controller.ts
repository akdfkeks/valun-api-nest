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
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { IssueService } from 'src/service/issue.service';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @UseGuards(StrictJwtGuard)
  @Post('')
  async createIssue(@Req() req: Request, @Body() body) {
    const issue = await this.issueService.createIssue(req.user, body.issue);
    return {
      message: 'success',
      data: {},
    };
  }

  @UseGuards(StrictJwtGuard)
  @Get(':id')
  async getIssueById(
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
