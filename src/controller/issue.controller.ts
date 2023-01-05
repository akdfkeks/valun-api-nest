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
import { GetIssuesDto, GetIssueQuery, PostIssueDto } from 'src/dto/issue.dto';
import { PostSolutionDto } from 'src/dto/solution.dto';
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
    @Body() solution: PostSolutionDto,
  ) {}

  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(StrictJwtGuard)
  @Post('')
  async postIssue(
    @Req() req: Request,
    @Body() issue: PostIssueDto,
    @UploadedFile() image: Express.Multer.File = null,
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
  // 최근 이슈 목록 조회
  @UseGuards(StrictJwtGuard)
  @Get('recent')
  async getRecentIssues(
    @Req() req: Request,
    @Query() getRecentIssuesDto: GetIssuesDto,
  ) {
    getRecentIssuesDto.categories = undefined;
    return await this.issueService.findAllIssues(
      req.user,
      getRecentIssuesDto,
      5,
    );
  }

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
  async getAllIssues(@Query() getIssuesDto: GetIssuesDto, @Req() req: Request) {
    // Temp
    let newArr = getIssuesDto.categories.filter((element) => {
      return element !== undefined && element !== null && element !== '';
    });
    getIssuesDto.categories = newArr.length == 0 ? undefined : newArr;

    return await this.issueService.findAllIssues(req.user, getIssuesDto);
  }
}
