import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controller/auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'valun',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
