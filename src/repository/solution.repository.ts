import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
class SolutionRepository {
  includeImage: { include: { image: boolean } };

  constructor(private prisma: PrismaService) {
    this.includeImage = { include: { image: true } };
  }

  public async create() {
    return await this.prisma.solution.create({
      data: {
        user: { connect: { id: 'test1' } },
        issue: { connect: { id: 1 } },
        description: 'test description text',
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
