import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user.controller';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';
import UserRepository from 'src/repository/user.repository';
import { UserService } from '../service/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, StrictJwtGuard],
  exports: [UserService, UserRepository],
})
export class UserModule {}
