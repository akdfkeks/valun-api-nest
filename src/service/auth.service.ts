import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'src/common/interface/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: UserLoginDto) {
    const payload = await this.validateUser(user.id, user.pw);
    const login = this.jwtService.sign(payload);
    return {
      message: '로그인에 성공하였습니다.',
      data: {
        accessToken: login,
      },
    };
  }

  private async validateUser(reqId: string, reqPw: string): Promise<any> {
    const user = await this.userService.findUniqueUser(reqId);

    if (!user) throw new UnauthorizedException('존재하지 않는 회원입니다.');

    const { pw, id, nick, broom, ...result } = user;
    // 비밀번호 검증
    if (!pw) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return { id, nick, broom };
  }

  public async validateJwt(token: string): Promise<string> {
    let id: string = null;

    try {
      const result = this.jwtService.verify(token);
      id = result.id;
    } catch (e) {}

    return id;
  }

  public async decodeJwt(token: string) {
    const payload = this.jwtService.decode(token);
  }
}
