import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    /****************************/
    /*** TIME ZONE MIDDLEWARE ***/
    /****************************/
    await this.$use(async (params, next) => {
      const result = await next(params);
      if (
        (params.model == 'Issue' && params.action == 'findMany') ||
        params.action == 'findUnique' ||
        params.action == 'findRaw'
      ) {
        try {
          if (result && result.createdAt) {
            // console.log(result);
            const kst = this.toKST(result.createdAt);
            result.createdAt = kst;
          }
        } catch (err) {
          console.log(err);
        }
      }
      return result;
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  private toKST(datetime: Date) {
    return dayjs(datetime).add(9, 'hours').toJSON();
  }
}
