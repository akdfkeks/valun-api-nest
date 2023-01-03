import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { UserLoginDto } from 'src/dto/user.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: UserLoginDto) {
    const login = await this.authService.login(user);
    return {
      message: '로그인에 성공하였습니다.',
      data: {
        accessToken: login,
      },
    };
  }
}
