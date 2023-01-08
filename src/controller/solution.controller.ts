import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
  constructor(
    private issueService: IssueService,
    private solutionService: SolutionService,
  ) {}

  @Post(':id/allow')
  async postAllow(
    @Param('id') id: number,
    @Req() req: Request,
    // @Body() accept: CreateAllowBody,
  ) {}

  @Post(':id/reject')
  async postRejection(
    @Req() req: Request,
    @Body() rejection: CreateRejectionBody,
  ) {}

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
