import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/repository/prisma.service';
import { ProductEntity } from 'src/product/domain/entities/product.entity';
import {
  ProductPort,
  ProductEnum,
} from 'src/product/domain/ports/product.port';

@Injectable()
export class ProductRepository implements ProductPort {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(product: any) {
    return new ProductEntity(
      product.id,
      product.name,
      product.price,
      product.type,
    );
  }

  async createProduct(name: string, price: number, type: ProductEnum) {
    const product = await this.prisma.product.create({ name, price, type });
    if (!product) throw new BadRequestException('Product not created');
    return this.mapToEntity(product);
  }

  async findProduct(id: string, name: string) {
    if (id !== undefined) {
      const product = await this.prisma.product.whereUnique({ id }).first();
      if (!product) throw new NotFoundException('Product not found');
      return this.mapToEntity(product);
    }
    if (name !== undefined) {
      const product = await this.prisma.product.where({ name }).first();

      if (!product) return null;
      return this.mapToEntity(product);
    } else {
      throw new BadRequestException('Invalid parameters');
    }
  }
}
