import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ProductEnum } from 'src/product/domain/ports/product.port';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Type(() => Number)
  price!: number;

  @IsEnum(ProductEnum)
  type!: ProductEnum;
}
