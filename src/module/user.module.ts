import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user.controller';
import UserRepository from 'src/repository/user.repository';
import { UserService } from '../service/user.service';
import { IssueModule } from './issue.module';
import { SolutionModule } from './solution.module';

@Module({
  imports: [IssueModule, SolutionModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
