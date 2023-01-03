// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post,
//   Req,
//   UseGuards,
// } from '@nestjs/common';
// import { Request } from 'express';
// import { CreateSolveDto } from 'src/dto/solve.dto';
// import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
// import { IssueService } from 'src/service/issue.service';
// import { SolveService } from 'src/service/sovle.service';

// @Controller('solutions')
// export class SolutionController {
//   constructor(
//     private issueService: IssueService,
//     private solutionService: SolveService,
//   ) {}

//   @Get(':id')
//   async getSolve(@Param('id', new ParseIntPipe()) id: number) {}

//   @UseGuards(StrictJwtGuard)
//   @Post(':id/allow')
//   async postAllowSolve(
//     @Param('id', new ParseIntPipe()) id: number,
//     @Body() solve: CreateSolveDto,
//   ) {}

//   @UseGuards(StrictJwtGuard)
//   @Post('')
//   async postSolve(@Body() solve: CreateSolveDto) {}
// }
