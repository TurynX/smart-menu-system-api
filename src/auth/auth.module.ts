import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { LoginUserUsecase } from './application/use-cases/login-user.use-case';
import { PrismaService } from '../lib/repository/prisma.service';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { AuthPort } from './domain/ports/auth.port';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './infrastructure/guards/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '1d',
        },
      }),
    }),
  ],
  providers: [
    PrismaService,
    { useClass: AuthRepository, provide: AuthPort },
    CreateUserUseCase,
    LoginUserUsecase,
    AuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthGuard, JwtModule, AuthPort],
})
export class AuthModule {}
