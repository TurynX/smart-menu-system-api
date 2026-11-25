import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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

export class FindProductByNameOrIdDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsEnum(ProductEnum)
  type!: ProductEnum;
}

export class GetProductsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductEnum, { message: 'Category not found' })
  category?: ProductEnum;
}
