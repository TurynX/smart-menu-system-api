import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthPort } from '../../domain/ports/auth.port';
import { PrismaService } from '../../../lib/repository/prisma.service';
import { UserEntity } from '../../domain/entities/auth.entity';

@Injectable()
export class AuthRepository implements AuthPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(user: any) {
    return new UserEntity(
      user.id,
      user.name,
      user.password,
      user.role,
      user.createdAt,
    );
  }

  async createUser(name: string, password: string) {
    const user = await this.prisma.user.create({
      name,
      password,
    });

    if (!user) {
      throw new InternalServerErrorException('Error creating user');
    }

    return this.mapToEntity(user);
  }

  async findUser(id?: string, name?: string) {
    if (id !== undefined) {
      const user = await this.prisma.user.where({ id }).first();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.mapToEntity(user);
    }

    const user = await this.prisma.user.where({ name }).first();

    if (!user) {
      return null;
    }

    return this.mapToEntity(user);
  }
}
