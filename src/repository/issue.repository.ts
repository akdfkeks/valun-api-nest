import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoriesOnIssue,
  Issue as PIssue,
  prisma,
  PrismaClient,
} from '@prisma/client';

@Injectable()
class IssueRepository {
  constructor(private prisma: PrismaClient) {}

  public async create({}) {
    //const result = await this.prisma.issue.create({ data: {} });
  }

  public async findOneById(id: number) {
    try {
      return await this.prisma.issue.findUnique({
        where: { id },
        include: {
          categories: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      throw new NotFoundException('No Data');
    }
  }

  public async findManyByUserId(userId: string) {
    try {
      return await this.prisma.issue.findMany({
        where: { userId },
        include: {
          categories: {
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      throw new NotFoundException('No Data');
    }
  }

  public async findManyByUserLatLngV1(
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

  public async findManyByUserLatLngV2(
    lat: number,
    lng: number,
    distance: number,
  ) {
    return await this.prisma.issue.findMany({
      where: {},
    });
  }
}

export default IssueRepository;
