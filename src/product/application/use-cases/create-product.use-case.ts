import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPort } from 'src/auth/domain/ports/auth.port';
import {
  ProductPort,
  ProductEnum,
} from 'src/product/domain/ports/product.port';

@Injectable()
export class CreateProductUsecase {
  constructor(
    private readonly authPort: AuthPort,
    private readonly productPort: ProductPort,
  ) {}

  async execute(
    userId: string,
    name: string,
    price: number,
    type: ProductEnum,
  ) {
    const isAdmin = await this.authPort.findUser(userId, undefined);
    if (!isAdmin || isAdmin?.role !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to create a product',
      );
    }

    const nameExists = await this.productPort.findProduct(undefined, name);

    if (nameExists) {
      throw new ConflictException('Product name already exists');
    }

    const product = await this.productPort.createProduct(name, price, type);

    return product;
  }
}
