import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  GetAllIssuesDto,
  GetRecentIssuesDto,
  PostIssueDto,
} from 'src/dto/issue.dto';
import { CreateSolutionDto } from 'src/dto/solution.dto';
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
  @Get(':id/solve')
  async getIssueSolution(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: Request,
  ) {
    return {
      message: '',
      data: {
        issue: {
          id: 1,
          userId: 'test1',
          description: 'bla bla bla',
          image: 'sample issue image',
        },
        solution: {
          id: 1,
          userId: 'test1',
          description: 'bla bla bla',
          image: 'sample solution image',
        },
      },
    };
  }

  @UseGuards(StrictJwtGuard)
  @Post(':id/solve')
  async postIssueSolution(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() solution: CreateSolutionDto,
  ) {}

  @UseGuards(StrictJwtGuard)
  @Post('')
  async postIssue(@Req() req: Request, @Body() issue: PostIssueDto) {
    const created = await this.issueService.createIssue(req.user, issue);
    return {
      message: '이슈를 등록하였습니다.',
      data: {},
    };
  }
  // 최근 이슈 목록 조회 - Query : [lat, lng, categories]
  @UseGuards(StrictJwtGuard)
  @Get('/recent')
  async getRecentIssues(
    @Query() getRecentIssuesDto: GetRecentIssuesDto,
    @Req() req: Request,
  ) {
    const { categories, lat, lng } = getRecentIssuesDto;
    return await this.issueService.findAllIssues(
      req.user,
      lat,
      lng,
      categories,
      3,
    );
  }

  @UseGuards(StrictJwtGuard)
  @Get(':id')
  async getIssue(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: Request,
  ) {
    return await this.issueService.findIssueById(req.user, id);
  }

  // 이슈 목록 조회 - Query : [lat, lng, categories]
  @UseGuards(StrictJwtGuard)
  @Get('')
  async getAllIssues(
    @Query() getIssuesDto: GetAllIssuesDto,
    @Req() req: Request,
  ) {
    const { categories, lat, lng } = getIssuesDto;
    return await this.issueService.findAllIssues(
      req.user,
      lat,
      lng,
      categories,
    );
  }
}
