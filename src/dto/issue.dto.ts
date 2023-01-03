import { Issue as PIssue } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class PostIssueDto {
  description: string;
  category: string;
  lat: number;
  lng: number;
}

export class GetIssuesDto {
  @IsArray()
  categories: string[];

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsNumber()
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
}

export interface RawIssue extends PIssue {
  category: { name: string };
  image: { location: string };
}
