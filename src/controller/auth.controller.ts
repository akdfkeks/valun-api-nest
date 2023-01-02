import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../provider/guard/local-auth.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const login = await this.authService.login(req.user);
    return {
      message: '로그인에 성공하였습니다.',
      data: {
        accessToken: login.access_token,
      },
    };
  }
}
