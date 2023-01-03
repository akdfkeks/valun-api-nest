import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateImageDto } from 'src/dto/image.dto';
import { PostIssueDto, RawIssue } from 'src/dto/issue.dto';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
class IssueRepository {
  private includeCategory: {
    category: { select: { name: boolean } };
    image: { select: { location: boolean } };
  };

  constructor(private prisma: PrismaService) {
    this.includeCategory = {
      category: {
        select: { name: true },
      },
      image: {
        select: { location: true },
      },
    };
  }

  public async create(
    userId: string,
    issueDto: PostIssueDto,
    imageDto: CreateImageDto,
  ) {
    try {
      return await this.prisma.issue.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          category: {
            connectOrCreate: {
              where: { name: issueDto.category },
              create: { name: issueDto.category },
            },
          },
          description: issueDto.description,
          lat: issueDto.lat,
          lng: issueDto.lng,
          image: {
            create: imageDto,
          },
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  public async findOneById(id: number): Promise<RawIssue> {
    return await this.prisma.issue.findUnique({
      where: { id },
      include: this.includeCategory,
    });
  }

  public async findManyByUserId(userId: string): Promise<RawIssue[]> {
    return await this.prisma.issue.findMany({
      where: { userId },
      include: this.includeCategory,
    });
  }

  public async findManyInCircleByLatLng(
    lat: number,
    lng: number,
    distance: number,
  ): Promise<RawIssue[]> {
    return await this.prisma.$queryRaw`
				SELECT *,
				(6371*acos(cos(radians(${lat}))*cos(radians(lat))*cos(radians(lng)-radians(${lng}))+sin(radians(${lat}))*sin(radians(lat)))) AS dist
				FROM Issue
				HAVING dist <= ${distance}
				ORDER BY dist 
				`;
    // order by createdAt 추가하기
  }

  public async findManyInSquareByLatLng(
    lat: number,
    lng: number,
    distance: number,
  ): Promise<RawIssue[]> {
    const { t, g } = this.distToLatLng(distance);

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
      include: this.includeCategory,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private distToLatLng(distance: number) {
    const KMPERLAT = 0.00899361453;
    const KMPERLNG = 0.01126126126;
    return { t: distance * KMPERLAT, g: distance * KMPERLNG };
  }
}

export default IssueRepository;
