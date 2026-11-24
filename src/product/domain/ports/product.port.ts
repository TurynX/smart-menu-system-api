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
}
