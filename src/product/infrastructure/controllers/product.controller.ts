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
import { FindProductByQueryUseCase } from 'src/product/application/use-cases/find-product-by-query';
import { FindAllProductsUseCase } from 'src/product/application/use-cases/find-all-products.use-case';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUsecase,
    private readonly findProductByQueryUseCase: FindProductByQueryUseCase,
    private readonly findAllProductUseCase: FindAllProductsUseCase,
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

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async findProductsByQuery(@Query() query: GetProductsQueryDto) {
    if (!query.search && !query.category) {
      throw new NotFoundException('Search or category is required');
    }
    const product = await this.findProductByQueryUseCase.execute(
      query.search,
      query.category,
    );

    return { data: product };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllProducts() {
    const product = await this.findAllProductUseCase.execute();

    return { data: product };
  }
}
