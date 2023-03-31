import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor() {
    super();

    this.$on('beforeExit', async () => {
      await new Promise(() => {
        // Do nothing, blocking the SIGINT behavior.
        // Let app call onApplicationShutdown and disconnect manually.
        // https://github.com/prisma/prisma/issues/2917#issuecomment-900693387
      });
    });
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.$connect();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.$disconnect();
  }
}
