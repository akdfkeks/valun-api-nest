import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    /****************************/
    /*** TIME ZONE MIDDLEWARE ***/
    /****************************/
    this.$use(async (params, next) => {
      if (params.model !== 'Issue') return next(params);

      const result = await next(params);
      if (!result) return result;

      if (params.action == 'findMany')
        return result.map((issue) => {
          issue.createdAt = this.toKST(issue.createdAt);
          return issue;
        });

      result.createdAt = this.toKST(result.createdAt);
      return result;
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => await app.close());
  }

  private toKST(datetime: Date) {
    // console.log(datetime);
    const d = dayjs(datetime).add(9, 'hours').toISOString().split('Z')[0];

    return d;
    // return dayjs(datetime).add(9, 'hours').format('YYYY-MM-DD HH:mm:ss');
  }
}
