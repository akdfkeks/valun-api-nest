import {
  Controller,
  UseGuards,
  Request,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { CreateUserDto } from 'src/interface/dto/user.dto';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async userSignup(@Body() userDto: CreateUserDto) {
    const result = await this.userService.signUp(userDto);
    if (result)
      return {
        message: '회원가입에 성공하였습니다.',
        data: { id: result.id, nick: result.nick },
      };
  }

  @UseGuards(StrictJwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
