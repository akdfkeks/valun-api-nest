import { Issue as PrismaIssue } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetIssuesQuery {
  @Transform(({ value }: { value: string }) => {
    return categoryParser(value, categoryJson);
  })
  @IsOptional()
  categories?: string[];

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsLongitude()
  @IsNotEmpty()
  lng: number;
}

export class CreateIssueBody {
  @IsNotEmpty()
  description: string = '';

  @IsString()
  @Transform(({ value }: { value: string }) => {
    return categoryParser(value, categoryJson)[0];
  })
  @IsNotEmpty()
  category: string = 'etc';

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

// DB 에서 읽어오던 JSON 으로 관리하던..고민중
const categoryJson = {
  플라스틱: 'plastic',
  PET: 'pet',
  금속: 'metal',
  종이: 'paper',
  일반쓰레기: 'trash',
  스티로폼: 'styrofoam',
  유리: 'glass',
  음식쓰레기: 'garbage',
  폐기물: 'waste',
  목재: 'lumber',
  비닐: 'vinyl',
  기타: 'etc',
} as const;

const categoryParser = (keys: string, obj: Record<string, string>) => {
  const categoryList = Object.values(obj);
  const refined = keys.split(',').filter((element) => {
    return categoryList.includes(element);
  });
  return refined.length == 0 ? undefined : refined;
};

Array;
