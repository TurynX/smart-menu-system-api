import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from 'src/product/domain/entities/product.entity';
import {
  ProductEnum,
  ProductPort,
} from 'src/product/domain/ports/product.port';
import { GetProductsQueryDto } from 'src/product/infrastructure/dtos/product.dto';

@Injectable()
export class FindProductByQuery {
  constructor(private readonly productPort: ProductPort) {}

  async execute(name?: string, type?: ProductEnum): Promise<ProductEntity[]> {
    const product = await this.productPort.findProductByFilters(name, type);
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
}
