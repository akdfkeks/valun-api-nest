import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
class IssueRepository {
  constructor(private prisma: PrismaClient) {}

  async create({}) {
    const result = await this.prisma.issue.create({ data: {} });
  }
}

export default IssueRepository;
