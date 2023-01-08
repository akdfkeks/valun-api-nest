import { Injectable } from '@nestjs/common';
import { CreateImageDto } from 'src/interface/dto/image.dto';
import { CreateSolutionBody } from 'src/interface/dto/solution.dto';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class SolutionRepository {
  includeImage: { include: { image: boolean } };

  constructor(private prisma: PrismaService) {
    this.includeImage = { include: { image: true } };
  }

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
      },
    });
  }

  public async findOneById(id: number) {
    return await this.prisma.solution.findUnique({
      where: { id },
      ...this.includeImage,
    });
  }

  public async findManyByIssueId(id: number) {
    return await this.prisma.solution.findMany({
      where: { issueId: id },
      ...this.includeImage,
    });
  }

  public async findManyByUserId(id: string) {
    return await this.prisma.solution.findMany({
      where: { userId: id },
      ...this.includeImage,
    });
  }
}

export default SolutionRepository;
