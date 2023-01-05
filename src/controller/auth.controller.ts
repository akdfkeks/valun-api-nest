import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { UserLoginDto } from 'src/dto/user.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: UserLoginDto) {
    return await this.authService.login(user);
  }
}
