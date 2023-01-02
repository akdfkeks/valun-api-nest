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
import { JwtAuthGuard } from 'src/provider/guard/jwt-auth.guard';
import { IssueService } from 'src/service/issue.service';

@Controller('issue')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createIssue(@Req() req: Request, @Body() body) {
    const issue = await this.issueService.createIssue(
      req.user.userId,
      body.issue,
    );
    return {
      message: 'success',
      data: {},
    };
  }

  @Get(':id')
  async getIssueById(@Param('id', new ParseIntPipe()) id: number) {
    const issue = await this.issueService.findIssueById(id);
    return {
      message: `Single issue with ID ${id}`,
      data: issue,
    };
  }
}
