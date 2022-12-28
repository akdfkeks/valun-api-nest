import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoriesOnIssue,
  Issue as PIssue,
  prisma,
  PrismaClient,
} from '@prisma/client';

@Injectable()
class IssueRepository {
  withCategories: {};
  constructor(private prisma: PrismaClient) {
    this.withCategories = {
      categories: {
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    };
  }

  public async create({}) {
    //const result = await this.prisma.issue.create({ data: {} });
  }

  public async findOneById(id: number) {
    try {
      return await this.prisma.issue.findUnique({
        where: { id },
        include: this.withCategories,
      });
    } catch (err) {
      throw new NotFoundException('No Data');
    }
  }

  public async findManyByUserId(userId: string) {
    try {
      return await this.prisma.issue.findMany({
        where: { userId },
        include: this.withCategories,
      });
    } catch (err) {
      throw new NotFoundException('No Data');
    }
  }

  public async findManyByLatLngV1(
    lat: number,
    lng: number,
    distance: number,
  ): Promise<
    PIssue & {
      categories: (CategoriesOnIssue & { category: { name: string } })[];
    }
  > {
    try {
      return await this.prisma.$queryRaw`
				SELECT *,
				(6371*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lng)-radians(${lng}))+sin(radians(${lat}))*sin(radians(lat)))) AS dist
				FROM Issue
				HAVING dist <= ${distance}
				ORDER BY dist 
				`;
    } catch (err) {}
  }

  public async findManyByLatLngV2(lat: number, lng: number, distance: number) {
    const { t, g } = this.getLatLng(distance);

    return await this.prisma.issue.findMany({
      where: {
        lat: {
          lte: lat + t,
          gte: lat - t,
        },
        lng: {
          lte: lng + g,
          gte: lng - g,
        },
      },
      include: this.withCategories,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private getLatLng(distance: number) {
    const KMPERLAT = 0.00899361453;
    const KMPERLNG = 0.01126126126;
    return { t: distance * KMPERLAT, g: distance * KMPERLNG };
  }
}

export default IssueRepository;
