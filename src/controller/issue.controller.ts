import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { GetIssuesQuery, CreateIssueBody } from 'src/interface/dto/issue.dto';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { IssueService } from 'src/service/issue.service';

/**
 * Controller method naming rules
 * (HTTP method type) + (Resource name)
 */

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(StrictJwtGuard)
  async postIssue(
    @Req() req: Request,
    @Body() issue: CreateIssueBody,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.issueService.createIssue(req.user, issue, image);
  }

  @Get('around')
  async getAroundIssues(
    @Req() req: Request,
    @Query() getIssuesDto: GetIssuesQuery,
  ) {
    return await this.issueService.findNearbyIssues(req.user, getIssuesDto);
  }

  // * Web : 최근 제보된 이슈를 조회합니다.
  @Get('samples')
  async getSampleIssues() {
    return await this.issueService.findSampleIssues();
  }

  @Get('recent')
  async getRecentIssues(
    @Req() req: Request,
    @Query() getIssuesQuery: Omit<GetIssuesQuery, 'categories'>,
  ) {
    return await this.issueService.findRecentIssues(req.user, getIssuesQuery);
  }

  // * APP : 사용자의 위치를 기준으로 특정 카테고리에 속하는 미해결 이슈를 반환합니다.

  // * APP : 이슈 고유 ID 로 특정한 이슈를 조회합니다.
  @Get(':id')
  async getIssue(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
    // @Query() field: GetIssueQuery = undefined,
  ) {
    return await this.issueService.findIssueById(req.user, id);
  }
}
