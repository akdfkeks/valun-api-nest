import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
class UserRepository {
  // constructor(private prisma: PrismaClient) {}

  async create({}) {
    //const result = await this.prisma.user.create({ data: {} });
  }

  async findById(id: string) {
    return { id: 'user1', pw: '1234' };
  }
}

export default UserRepository;
