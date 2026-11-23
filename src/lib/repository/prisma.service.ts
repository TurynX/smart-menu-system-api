import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from '../../prisma/db';

export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client = db;

  get user() {
    return this.client.orm.public.User;
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
