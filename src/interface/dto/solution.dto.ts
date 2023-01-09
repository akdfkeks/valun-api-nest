import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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

export interface ISolution {}
