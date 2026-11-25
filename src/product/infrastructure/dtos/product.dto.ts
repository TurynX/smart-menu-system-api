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
  @IsString()
  name!: string;

  @IsNumber()
  @Type(() => Number)
  price!: number;

  @IsEnum(ProductEnum)
  type!: ProductEnum;
}

export class GetProductsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
