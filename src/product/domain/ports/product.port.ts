import { GetProductsQueryDto } from 'src/product/infrastructure/dtos/product.dto';
import { ProductEntity } from '../entities/product.entity';
export enum ProductEnum {
  FOOD = 'food',
  DRINK = 'drink',
  DESSERT = 'dessert',
}

export abstract class ProductPort {
  abstract createProduct(
    name: string,
    price: number,
    type: ProductEnum,
  ): Promise<ProductEntity>;

  abstract findProduct(
    id?: string,
    name?: string,
  ): Promise<ProductEntity | null>;

  abstract findAllProducts(): Promise<ProductEntity[]>;

  abstract findProductByFilters(
    query: GetProductsQueryDto,
  ): Promise<ProductEntity[]>;

  abstract updateProduct(
    id: string,
    name?: string,
    price?: number,
    type?: ProductEnum,
  ): Promise<ProductEntity>;

  abstract deleteProduct(id: string): Promise<void>;
}
