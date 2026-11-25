import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/repository/prisma.service';
import { db } from 'src/prisma/db';
import { ProductEntity } from 'src/product/domain/entities/product.entity';
import {
  ProductPort,
  ProductEnum,
} from 'src/product/domain/ports/product.port';
import { GetProductsQueryDto } from '../dtos/product.dto';

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
    try {
      if (id !== undefined) {
        const product = await this.prisma.product
          .whereUnique({ id })
          .firstOrThrow();
        return this.mapToEntity(product);
      }
    } catch (error: any) {
      console.log(error);
      if (error.code === 'RUNTIME.NO_ROWS')
        throw new NotFoundException('Product not found');
    }
    if (name !== undefined) {
      const product = await this.prisma.product.where({ name }).firstOrThrow();

      if (!product) return null;

      return this.mapToEntity(product);
    } else {
      throw new BadRequestException('Invalid parameters');
    }
  }

  async findAllProducts() {
    const product = await this.prisma.product.all();
    if (product.length === 0) throw new NotFoundException('No product found');
    return product.map((p) => this.mapToEntity(p));
  }

  async findProductByFilters(query: GetProductsQueryDto) {
    const { search, category } = query;

    let filters: any = [];

    if (category) {
      filters.category = category;
    }

    if (search) {
      filters.name = { ilike: `%${search}%` };
    }
    const product = await this.prisma.product.where(filters).all();
    if (product.length === 0)
      throw new NotFoundException('No products found with the given filters');

    return product.map((p) => this.mapToEntity(p));
  }

  async updateProduct(
    id: string,
    name?: string,
    price?: number,
    type?: ProductEnum,
  ) {
    try {
      const product = await this.prisma.product
        .where({ id })
        .update({ name, price, type });

      return this.mapToEntity(product);
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }
      throw new InternalServerErrorException('Error in updating product');
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.prisma.product.where({ id }).delete();
      return;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Product not found');
      }

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Cannot delete product because it is associated with an order',
        );
      }

      throw new InternalServerErrorException('Error in deleting product');
    }
  }
}
