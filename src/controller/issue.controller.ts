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
import { CreateSolutionBody } from 'src/interface/dto/solution.dto';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { IssueService } from 'src/service/issue.service';

/**
 * Controller method naming rules
 * (HTTP method type) + (Resource name)
 */

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @UseGuards(StrictJwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('')
  async postIssue(
    @Req() req: Request,
    @Body() issue: CreateIssueBody,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const created = await this.issueService.createIssue(req.user, issue, image);
    return {
      message: '이슈를 등록하였습니다.',
      data: {
        id: created.id,
        createdAt: created.createdAt,
      },
    };
  }

  // Web 용 Sample Issue 조회
  @Get('samples')
  async getSampleIssues() {
    return await this.issueService.findSampleIssues();
  }

  // 단일 이슈 조회
  @Get(':id')
  async getIssue(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
    // @Query() field: GetIssueQuery = undefined,
  ) {
    return await this.issueService.findIssueById(req.user, id);
  }

  // 주변 이슈 목록 조회
  @Get('')
  async getAllIssues(
    @Query() getIssuesDto: GetIssuesQuery,
    @Req() req: Request,
  ) {
    return await this.issueService.findNearbyIssues(req.user, getIssuesDto);
  }
}
