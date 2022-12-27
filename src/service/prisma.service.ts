import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    /****************************/
    /*** TIME ZONE MIDDLEWARE ***/
    /****************************/
    await this.$use(async (params, next) => {
      if (params.model == 'Issue') {
        console.log(params.args['createdAt']);
      }
      return next(params);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
