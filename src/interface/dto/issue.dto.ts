import {
  Issue as PrismaIssue,
  IssueCategory,
  IssueComment,
  IssueImage,
  IssueStatus,
  Solution,
  SolutionImage,
  User,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { categoryParser } from 'src/util/issue';

export class GetIssuesQuery {
  @Transform(({ value }: { value: string }) => {
    return categoryParser(value, categoryJson);
  })
  @IsOptional()
  categories?: string[];

  @IsLatitude()
  @Type(() => Number)
  @IsNotEmpty()
  lat: number;

  @IsLongitude()
  @Type(() => Number)
  @IsNotEmpty()
  lng: number;
}

export class IssueStatusQuery {
  @IsNotEmpty()
  status: IssueStatus;
}

export class CreateIssueBody {
  @IsNotEmpty()
  description: string = '';

  @IsString()
  @Transform(({ value }: { value: string }) => {
    const c = categoryParser(value, categoryJson);
    if (!c) return 'etc';
    return c[0];
  })
  @IsNotEmpty()
  category: string = 'etc';

  @IsLatitude()
  @Type(() => Number)
  @IsNotEmpty()
  lat: number;

  @IsLongitude()
  @Type(() => Number)
  @IsNotEmpty()
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

export interface IExtendedRawIssue extends PrismaIssue {
  category: { name: string };
  image: { location: string };
}

export type IssueIncludable = {
  user: User;
  image: IssueImage;
  category: IssueCategory;
  solutions: (Solution & { image: SolutionImage })[];
  issueComments: IssueComment[];
};

export interface ISolvedIncludable extends IIssueIncludable {
  solutions: (Solution & { image: SolutionImage })[];
}

export interface IIssueIncludable {
  user?: User;
  image: IssueImage;
  category: IssueCategory;
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
