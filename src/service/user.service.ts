import { Injectable } from '@nestjs/common';
import UserRepository from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUniqueUser(id: string) {
    const user = await this.userRepository.findById(id);

    return user;
  }
}
