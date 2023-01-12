import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from 'src/provider/middleware/auth.middleware';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { AuthModule } from './auth.module';
import { IssueModule } from './issue.module';
import { GlobalModule } from './global.module';
import { UserModule } from './user.module';
import { RequestLogger } from 'src/provider/middleware/req-logger.middleware';
import { SolutionModule } from './solution.module';

@Module({
  imports: [AuthModule, UserModule, IssueModule, SolutionModule, GlobalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogger).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
