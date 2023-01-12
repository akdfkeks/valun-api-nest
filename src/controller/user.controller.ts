import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/common/interface/dto/user.dto';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { UserService } from 'src/service/user.service';
import { Request } from 'express';
import { IssueService } from 'src/service/issue.service';
import { Query } from '@nestjs/common';
import { IssueStatus } from '@prisma/client';
import { IssueStatusQuery } from 'src/common/interface/dto/issue.dto';
import { SolutionService } from 'src/service/solution.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly issueService: IssueService,
    private readonly solutionService: SolutionService,
  ) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post('signup')
  async userSignup(
    @Body() userDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const result = await this.userService.signUp(userDto, image);
    if (result)
      return {
        message: '회원가입에 성공하였습니다.',
        data: { id: result.id, nick: result.nick },
      };
  }

  @Post('exist/id')
  async checkIdExist(@Body('id') id: string) {
    const user = await this.userService.findUniqueUserById(id);
    return {
      message: user ? '이미 사용중인 ID 입니다.' : '사용 가능한 ID 입니다.',
      data: {
        available: user ? false : true,
      },
    };
  }

  @Post('exist/nick')
  async checkNickExist(@Body('nick') nick: string) {
    const user = await this.userService.findUniqueUserByNick(nick);
    return {
      message: user
        ? '이미 사용중인 닉네임 입니다.'
        : '사용 가능한 닉네임 입니다.',
      data: {
        available: user ? false : true,
      },
    };
  }

  @UseGuards(StrictJwtGuard)
  @Get('my/profile')
  async getMyProfile(@Req() req: Request) {
    return await this.userService.findUserProfileWithNoti(req.user);
  }

  @UseGuards(StrictJwtGuard)
  @Get('my/issues')
  async getMyIssues(@Req() req: Request) {
    return await this.issueService.findMyIssues(req.user);
  }

  @UseGuards(StrictJwtGuard)
  @Get('my/solutions')
  async getMySolutions(@Req() req: Request) {
    return await this.solutionService.findMySolutionsWithIssue(req.user);
  }
}
