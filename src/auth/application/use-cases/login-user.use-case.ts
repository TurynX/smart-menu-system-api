import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthPort } from '../../domain/ports/auth.port';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUserUsecase {
  constructor(
    private readonly authPort: AuthPort,
    private readonly jwt: JwtService,
  ) {}

  async execute(name: string, password: string) {
    const user = await this.authPort.findUser(undefined, name);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const compare = await argon2.verify(user.password, password);
    if (!compare) {
      throw new BadRequestException('Invalid credentials');
    }

    const { password: _password, ...userWithoutPassword } = user;

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const token = await this.jwt.signAsync(payload);

    return { userWithoutPassword, token };
  }
}
