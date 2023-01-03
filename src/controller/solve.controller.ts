import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateSolveDto } from 'src/dto/solve.dto';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { IssueService } from 'src/service/issue.service';
import { SolveService } from 'src/service/sovle.service';

@Controller('solves')
export class SolveController {
  constructor(
    private issueService: IssueService,
    private solveService: SolveService,
  ) {}

  @Get('')
  async getSolve(@Body() solve: CreateSolveDto) {}

  @Post('')
  async postSolve(@Body() solve: CreateSolveDto) {}
}
