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

export class CreateSolutionBody {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  issueId: number;

  @IsNotEmpty()
  description: string = '';

  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  lat: number;

  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  lng: number;
}

export class CreateRejectionBody {
  @IsString()
  @IsNotEmpty()
  message: string = '';
}
