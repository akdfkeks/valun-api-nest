import { Solution as PSolution } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { IIssue } from './issue.dto';

export class CreateSolutionBody {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  issueId: number;

  @IsNotEmpty()
  description: string = '';

  @Type(() => Number)
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @Type(() => Number)
  @IsLongitude()
  @IsNotEmpty()
  lng: number;
}

export class CreateRejectionBody {
  @IsString()
  @IsNotEmpty()
  message: string = '';
}

export interface AcceptSolutionResBody {
  issue: IIssue;
  solution: ISolution;
}

export interface IRawSolution extends PSolution {
  image: { location: string };
}

export interface ISolution {
  id: number;
  userId: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: Date;
  imageUrl: string;
  isMine: boolean;
}
