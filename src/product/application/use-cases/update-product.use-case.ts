import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPort } from 'src/auth/domain/ports/auth.port';
import {
  ProductPort,
  ProductEnum,
} from 'src/product/domain/ports/product.port';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly authPort: AuthPort,
    private readonly productPort: ProductPort,
  ) {}

  async execute(
    productId: string,
    userId: string,
    name?: string,
    price?: number,
    type?: ProductEnum,
  ) {
    const isAdmin = await this.authPort.findUser(userId, undefined);
    if (!isAdmin || isAdmin?.role !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to create a product',
      );
    }

    const productExists =
      await this.productPort.findProductByNameOrId(productId);

    const product = await this.productPort.updateProduct(
      productExists!.id,
      name,
      price,
      type,
    );

    return product;
  }
}
