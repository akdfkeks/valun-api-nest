import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
class SolveRepository {
  includeImage: { include: { image: boolean } };

  constructor(private prisma: PrismaService) {
    this.includeImage = { include: { image: true } };
  }

  public async create() {}

  public async findOneById(id: number) {
    return await this.prisma.solve.findUnique({
      where: { id },
      ...this.includeImage,
    });
  }

  public async findManyByIssueId(id: number) {
    return await this.prisma.solve.findMany({
      where: { issueId: id },
      ...this.includeImage,
    });
  }

  public async findManyByUserId(id: string) {
    return await this.prisma.solve.findMany({
      where: { userId: id },
      ...this.includeImage,
    });
  }
}

export default SolveRepository;
