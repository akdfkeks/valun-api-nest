import { Issue as PIssue } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostIssueDto {
  description: string;
  category: string;
  lat: number;
  lng: number;
}

export class GetRecentIssuesDto {
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  categories: string[] = [];

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  lng: number;
}

export class GetAllIssuesDto {
  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  categories: string[] = [];

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  lng: number;
}

export interface IIssue {
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

export interface RawIssue extends PIssue {
  category: { name: string };
  image: { location: string };
}
