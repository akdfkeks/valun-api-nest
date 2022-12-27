import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../provider/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../provider/jwt.strategy';
import { AuthController } from 'src/controller/auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'valun',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
