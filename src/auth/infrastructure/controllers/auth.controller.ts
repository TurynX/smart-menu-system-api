import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../dtos/auth.dto';
import type { Request } from 'express';
import { LoginUserUsecase } from 'src/auth/application/use-cases/login-user.use-case';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUsecase,
  ) {}

  @Post('create-user')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDto) {
    const result = await this.createUserUseCase.execute(
      body.name,
      body.password,
    );
    return { message: 'User created successfully', data: result };
  }

  @Post('login-user')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() body: CreateUserDto) {
    const result = await this.loginUserUseCase.execute(
      body.name,
      body.password,
    );

    return { message: 'User logged successfully', data: result };
  }
}
