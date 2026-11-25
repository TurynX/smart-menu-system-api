import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from 'src/product/domain/entities/product.entity';
import { ProductPort } from 'src/product/domain/ports/product.port';

@Injectable()
export class FindAllProductsUseCase {
  constructor(private readonly productPort: ProductPort) {}

  async execute(): Promise<ProductEntity[]> {
    const product = await this.productPort.findAllProducts();
    if (!product) throw new NotFoundException('Product not found');

    return product;
  }
}
