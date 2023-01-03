import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controller/auth.controller';
import { StrictJwtGuard } from 'src/provider/guard/strict-jwt.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'valun',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, StrictJwtGuard],
  exports: [AuthService],
})
export class AuthModule {}
