import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPort } from 'src/auth/domain/ports/auth.port';
import { ProductPort } from 'src/product/domain/ports/product.port';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    private readonly authPort: AuthPort,
    private readonly productPort: ProductPort,
  ) {}

  async execute(userId: string, productId: string) {
    const isAdmin = await this.authPort.findUser(userId, undefined);
    if (!isAdmin || isAdmin?.role !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to create a product',
      );
    }

    const productExists =
      await this.productPort.findProductByNameOrId(productId);

    const product = await this.productPort.deleteProduct(productExists!.id);

    if (product === true) return product;

    throw new InternalServerErrorException('Error in deleting product');
  }
}
