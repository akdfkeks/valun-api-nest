import { Injectable } from '@nestjs/common';
import { argon2i, hash, verify } from 'argon2';
import { CreateUserDto } from 'src/interface/dto/user.dto';
import UserRepository from '../repository/user.repository';
import { StorageService } from './storage.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private storageService: StorageService,
  ) {}

  async signUp(userDto: CreateUserDto, image) {
    const hashed = await this.hashPw(userDto.pw);
    const { location } = await this.storageService.upload(image, {
      resize: { width: 256 },
    });
    return await this.userRepository.create(
      {
        id: userDto.id,
        pw: hashed,
        nick: userDto.nick,
      },
      location,
    );
  }

  async findUserProfile(userId: string) {
    const { id, nick, broom, profileImage } =
      await this.userRepository.findById(userId);
    return {
      message: '내 정보',
      data: {
        profile: {
          id,
          nick,
          broom,
          profileImage,
        },
      },
    };
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
