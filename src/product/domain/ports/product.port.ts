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

  abstract findProductByNameOrId(
    id?: string,
    name?: string,
  ): Promise<ProductEntity | null>;

  abstract findAllProducts(): Promise<ProductEntity[]>;

  abstract findProductByFilters(
    name?: string,
    type?: ProductEnum,
  ): Promise<ProductEntity[]>;

  abstract updateProduct(
    id: string,
    name?: string,
    price?: number,
    type?: ProductEnum,
  ): Promise<ProductEntity>;

  abstract deleteProduct(id: string): Promise<boolean>;
}
