import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import {
  CreateProductDto,
  FindProductByNameOrIdDto,
} from '../dtos/product.dto';
import { CreateProductUsecase } from 'src/product/application/use-cases/create-product.use-case';
import { FindProductByNameOrIdUseCase } from 'src/product/application/use-cases/find-product-by-name-or-id.use-case';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUsecase,
    private readonly findProductByNameOrIdUseCase: FindProductByNameOrIdUseCase,
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

  @Post('find')
  @HttpCode(HttpStatus.OK)
  async findProductByNameOrId(@Body() body: FindProductByNameOrIdDto) {
    const product = await this.findProductByNameOrIdUseCase.execute(
      body.id,
      body.name,
    );

    return { data: product };
  }
}
