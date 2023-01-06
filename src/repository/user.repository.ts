import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/interface/dto/user.dto';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(userDto: CreateUserDto, imageUrl: string) {
    return await this.prisma.user.create({
      data: { ...userDto, profileImage: imageUrl },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByUud(uuid: string) {
    return await this.prisma.user.findUnique({
      where: { uuid },
    });
  }
}

export default UserRepository;
