import { Injectable } from '@nestjs/common';
import {
  Issue,
  IssueCategory,
  IssueComment,
  IssueImage,
  IssueStatus,
  Solution,
  User,
} from '@prisma/client';
import { CreateImageDto } from 'src/interface/dto/image.dto';
import {
  CreateIssueBody,
  IExtendedRawIssue,
  IssueIncludable,
} from 'src/interface/dto/issue.dto';
import { PrismaService } from 'src/service/prisma.service';
import {
  categoryAndImage,
  createIssueWithImageValidator,
} from './validator/issue.validator';

@Injectable()
class IssueRepository {
  constructor(private prisma: PrismaService) {}

  // Fix
  public async create(
    userId: string,
    issueBody: CreateIssueBody,
    imageDto: CreateImageDto,
  ) {
    return await this.prisma.issue.create({
      data: createIssueWithImageValidator(userId, issueBody, imageDto),
    });
  }

  public async updateOne({
    id,
    status = undefined,
    description = undefined,
    category = undefined,
  }: {
    id: number;
    status?: IssueStatus;
    description?: string;
    category?: string;
  }) {
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

  public async findManyUnsolvedsByUserId(
    userId: string,
  ): Promise<
    (Issue & Omit<IssueIncludable, 'user' | 'issueComments' | 'solutions'>)[]
  > {
    return await this.prisma.issue.findMany({
      where: { userId, status: 'UNSOLVED' },
      include: {
        category: true,
        image: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async findManyWithSolutionsByUserId(
    userId: string,
    status: 'PENDING' | 'SOLVED',
  ): Promise<(Issue & Omit<IssueIncludable, 'user' | 'issueComments'>)[]> {
    return await this.prisma.issue.findMany({
      where: { userId, status },
      include: {
        category: true,
        image: true,
        solutions: {
          include: {
            image: true,
          },
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  //----------------------------------------------------------------

  public async findOneById(id: number) {
    return await this.prisma.issue.findUnique({
      where: { id },
      include: categoryAndImage,
    });
  }

  public async findManyByUserId(userId: string): Promise<IExtendedRawIssue[]> {
    return await this.prisma.issue.findMany({
      where: { userId, status: 'UNSOLVED' },
      include: categoryAndImage,
    });
  }

  public async findManyInCircleByLatLng(
    lat: number,
    lng: number,
    distance: number,
  ): Promise<any[]> {
    return await this.prisma.$queryRaw`
				SELECT *,
				(6371*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lng)-radians(${lng}))+sin(radians(${lat}))*sin(radians(lat)))) AS dist
				FROM Issue
				HAVING dist <= ${distance}
				ORDER BY dist 
				`;
    // order by createdAt 추가하기
  }

  public async findMany({
    userId = undefined,
    lat = undefined,
    lng = undefined,
    categories = undefined,
    status = undefined,
    take = undefined,
  }: {
    userId?: string;
    lat?: number;
    lng?: number;
    status?: IssueStatus;
    categories?: string[];
    take?: number;
  }): Promise<IExtendedRawIssue[]> {
    // 나중에 없애기
    const { t, g } = this.getLatLngRange();

    return await this.prisma.issue.findMany({
      where: {
        userId,
        status,
        category: categories ? { name: { in: categories } } : undefined,
        lat: lat ? { lte: lat + t, gte: lat - t } : undefined,
        lng: lng ? { lte: lng + g, gte: lng - g } : undefined,
      },
      include: categoryAndImage,
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  public async findByUserIdWithSolution(
    userId: string,
    status: IssueStatus,
  ): Promise<(Issue & { image: any; category: any; solutions: any })[]> {
    return await this.prisma.issue.findMany({
      where: { userId: userId, status },
      include: {
        ...categoryAndImage,
        solutions: {
          include: {
            image: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  // 이놈이 함수로 존재할 이유가 없는데 나중에 고칠래
  private getLatLngRange() {
    const KMPERLAT = 0.00899361453;
    const KMPERLNG = 0.01126126126;
    const RADIUS = 3;
    return { t: RADIUS * KMPERLAT, g: RADIUS * KMPERLNG };
  }
}

export default IssueRepository;
