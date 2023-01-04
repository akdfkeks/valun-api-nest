import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ log: [{ emit: 'event', level: 'query' }] });
  }
  async onModuleInit() {
    await this.$connect();

    /****************************/
    /*** TIME ZONE MIDDLEWARE ***/
    /****************************/
    await this.$use(async (params, next) => {
      if (params.model !== 'Issue') return next(params);

      const result = await next(params);
      if (params.action == 'findMany')
        return result.map((issue) => {
          issue.createdAt = this.toKST(issue.createdAt);
          return issue;
        });

      result.createdAt = this.toKST(result.createdAt);
      return result;
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  private toKST(datetime: Date) {
    // console.log(datetime);
    const d = dayjs(datetime).add(9, 'hours').toISOString().split('Z')[0];

    return d;
    // return dayjs(datetime).add(9, 'hours').format('YYYY-MM-DD HH:mm:ss');
  }
}
