import { Injectable } from '@nestjs/common';
import { CreateImageDto } from 'src/interface/dto/image.dto';
import { CreateSolutionBody } from 'src/interface/dto/solution.dto';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class SolutionRepository {
  constructor(private prisma: PrismaService) {}

  public async create(
    userId: string,
    solutionBody: CreateSolutionBody,
    imageDto: CreateImageDto,
  ) {
    return await this.prisma.solution.create({
      data: {
        user: { connect: { id: userId } },
        issue: { connect: { id: solutionBody.issueId } },
        description: solutionBody.description,
        image: { create: { ...imageDto } },
        lat: solutionBody.lat,
        lng: solutionBody.lng,
      },
    });
  }

  public async findOneById(id: number) {
    return await this.prisma.solution.findUnique({
      where: { id },
      include: {
        issue: true,
      },
    });
  }

  public async findManyByIssueId(id: number) {
    return await this.prisma.solution.findMany({
      where: { issueId: id },
    });
  }

  public async findManyByUserId(id: string) {
    return await this.prisma.solution.findMany({
      where: { userId: id },
    });
  }
}

export default SolutionRepository;
