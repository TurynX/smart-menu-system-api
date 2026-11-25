import { Module } from '@nestjs/common';
import { CreateProductUsecase } from './application/use-cases/create-product.use-case';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductPort } from './domain/ports/product.port';
import { AuthModule } from 'src/auth/auth.module';
import { ProductController } from './infrastructure/controllers/product.controller';
import { PrismaService } from 'src/lib/repository/prisma.service';
import { FindProductByQuery } from './application/use-cases/find-product-by-query';

@Module({
  imports: [AuthModule],
  providers: [
    PrismaService,
    { useClass: ProductRepository, provide: ProductPort },
    CreateProductUsecase,
    FindProductByQuery,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
