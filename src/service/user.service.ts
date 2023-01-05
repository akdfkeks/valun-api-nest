import { Injectable } from '@nestjs/common';
import { argon2i, hash, verify } from 'argon2';
import { CreateUserDto } from 'src/interface/dto/user.dto';
import UserRepository from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(userDto: CreateUserDto) {
    const hashed = await this.hashPw(userDto.pw);
    return await this.userRepository.create({
      id: userDto.id,
      pw: hashed,
      nick: userDto.nick,
    });
  }

  async findUniqueUser(id: string) {
    return await this.userRepository.findById(id);
  }

  private async hashPw(plain: string) {
    return await hash(plain, { type: argon2i });
  }

  private async verifyPw(plain: string, hashed: string) {
    return await verify(plain, hashed, { type: argon2i });
  }
}
