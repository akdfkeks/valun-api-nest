import { Injectable } from '@nestjs/common';
import { Issue, IssueStatus, Prisma } from '@prisma/client';
import { IUploadedImage } from 'src/common/interface/dto/image.dto';
import {
  CreateIssueBody,
  IIssueIncludable,
  ISolvedIncludable,
} from 'src/common/interface/dto/issue.dto';
import { PrismaService } from 'src/service/prisma.service';
import { ISearchByLocal } from '../validator/issue.validator';

const LATPERKM = 0.00899361453;
const LNGPERKM = 0.01126126126;
const RANGE = 3;

@Injectable()
export class IssueRepository {
  /**
   * Prisma Issue Object 를 직접 제공합니다.
   */
  public issue: Prisma.IssueDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(private readonly prisma: PrismaService) {
    this.issue = prisma.issue;
  }

  /**
   * 이슈를 생성합니다.
   */
  async create(userId: string, issue: CreateIssueBody, image: IUploadedImage) {
    return await this.issue.create({
      data: {
        user: { connect: { id: userId } },
        category: { connect: { name: issue.category } },
        description: issue.description,
        lat: issue.lat,
        lng: issue.lng,
        image: { create: image },
      },
    });
  }

  /**
   * Issue ID 를 통해 특정 이슈를 조회합니다.
   * 만약 존재하지 않는다면 NotFoundError 를 발생시킵니다.
   */
  async findOneById(id: number): Promise<Issue> {
    return await this.issue.findUniqueOrThrow({ where: { id } });
  }

  /**
   * 위도, 경도, 카테고리(Optional) 를 기준으로 "UNSOLVED" 상태의 이슈를 조회합니다.
   * @param params: Object { lat, lng, categories, take }
   * @arg lat 위도
   * @arg lng 경도
   * @arg categories 조회할 카테고리
   * @arg take 조회할 이슈의 수
   */
  async findManyUnsolvedByLocation(
    params: ISearchByLocal,
  ): Promise<(Issue & IIssueIncludable)[]> {
    return await this.issue.findMany({
      where: {
        status: 'UNSOLVED',
        category: params.categories
          ? { name: { in: params.categories } }
          : undefined,
        lat: params.lat
          ? {
              lte: params.lat + LATPERKM * RANGE,
              gte: params.lat - LATPERKM * RANGE,
            }
          : undefined,
        lng: params.lng
          ? {
              lte: params.lng + LNGPERKM * RANGE,
              gte: params.lng - LNGPERKM * RANGE,
            }
          : undefined,
      },
      include: {
        image: true,
        category: true,
      },
      take: params.take,
    });
  }

  /**
   * User ID 를 기준으로 "UNSOLVED" 상태의 이슈를 조회합니다.
   */
  async findManyUnsolvedByUserId(
    userId: string,
  ): Promise<(Issue & IIssueIncludable)[]> {
    return await this.issue.findMany({
      where: {
        userId,
        status: 'UNSOLVED',
      },
      include: {
        image: true,
        category: true,
      },
    });
  }

  /**
   * User ID 를 기준으로 특정 상태의 이슈를 조회합니다.
   * Issue 에 연결된 Solution Table 의 가장 최근 데이터 (1개) 함께 반환합니다.
   */
  async findManyHasSolutionByUserId(
    userId: string,
    status: IssueStatus,
  ): Promise<(Issue & ISolvedIncludable)[]> {
    return await this.issue.findMany({
      where: { userId, status },
      include: {
        image: true,
        category: true,
        solutions: {
          include: { image: true },
          orderBy: { id: 'desc' },
          take: 1,
        },
      },
    });
  }

  /**
   * (수정 예정) Issue ID 를 통해 특정 필드의 값을 업데이트합니다.
   */
  public async updateOneById({
    id,
    status = undefined,
    description = undefined,
    category = undefined,
  }: {
    id: number;
    status?: IssueStatus;
    description?: string;
    category?: string;
  }): Promise<Issue> {
    return await this.prisma.issue.update({
      where: { id },
      data: {
        status,
        description,
        category: category
          ? {
              connectOrCreate: {
                create: { name: category },
                where: { name: category },
              },
            }
          : undefined,
      },
    });
  }
}
