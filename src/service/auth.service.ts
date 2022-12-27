import { Injectable } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { userId: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(id: string, pw: string): Promise<any> {
    const user = await this.userService.findUniqueUser(id);
    if (user && user.pw === pw) {
      const { pw, ...result } = user;
      return result;
    }
    return null;
  }
}
