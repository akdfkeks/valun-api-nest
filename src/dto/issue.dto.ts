import { Issue as PrismaIssue } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetIssueQuery {
  @Transform(({ value }) => value.split(','))
  fields?: string[] = undefined;
}

export class GetIssuesDto {
  @IsArray()
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  categories?: string[];

  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  lat: number;

  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  lng: number;
}

export class PostIssueDto {
  @IsString()
  description: string = '';

  @IsString()
  category: string;

  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  lat: number;

  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  lng: number;
}

export interface IExtendedIssue {
  id: number;
  userId: string;
  status: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: Date;
  imageUrl: string;
  isMine: boolean;
}

export interface IExtendedRawIssue extends PrismaIssue {
  category: { name: string };
  image: { location: string };
}

type TIssueField = keyof IExtendedIssue;
const IssueField: TIssueField[] = [];
