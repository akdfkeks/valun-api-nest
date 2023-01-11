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
import {
  CreateRejectionBody,
  CreateSolutionBody,
} from 'src/interface/dto/solution.dto';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { IssueService } from 'src/service/issue.service';
import { SolutionService } from 'src/service/solution.service';

@UseGuards(StrictJwtGuard)
@Controller('solutions')
export class SolutionController {
  constructor(private solutionService: SolutionService) {}

  @Post(':id/accept')
  async postAllow(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.solutionService.acceptSolution(req.user, id);
  }

  @Post(':id/reject')
  async postRejection(
    @Req() req: Request,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() rejection: CreateRejectionBody,
  ) {
    return this.solutionService.rejectSolution(req.user, id, rejection);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('')
  async postSolution(
    @Req() req: Request,
    @Body() solution: CreateSolutionBody,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.solutionService.createSolution(req.user, solution, image);
  }
}
