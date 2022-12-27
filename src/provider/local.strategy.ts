import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userId',
      passwordField: 'userPw',
    });
  }

  async validate(reqId: string, reqPw: string): Promise<any> {
    //console.log(`validate(${reqId}, ${reqPw}) called`);
    const user = await this.authService.validateUser(reqId, reqPw);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
