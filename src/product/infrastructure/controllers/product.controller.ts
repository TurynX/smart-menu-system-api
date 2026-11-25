import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import {
  CreateProductDto,
  FindProductByNameOrIdDto,
  GetProductsQueryDto,
} from '../dtos/product.dto';
import { CreateProductUsecase } from 'src/product/application/use-cases/create-product.use-case';
import { FindProductByQuery } from 'src/product/application/use-cases/find-product-by-query';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUsecase,
    private readonly findProductByQuery: FindProductByQuery,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Req() req: Request, @Body() body: CreateProductDto) {
    const userId = req['user'].sub;
    if (!userId) throw new UnauthorizedException('UserId not provided');

    const product = await this.createProductUseCase.execute(
      userId,
      body.name,
      body.price,
      body.type,
    );

    return { data: product };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findProductsFiltereds(@Query() query: GetProductsQueryDto) {
    if (!query.search && !query.category) {
      throw new NotFoundException('Search or category is required');
    }
    const product = await this.findProductByQuery.execute(
      query.search,
      query.category,
    );

    return { data: product };
  }
}
