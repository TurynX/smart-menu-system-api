import { ConflictException, Injectable } from '@nestjs/common';
import { AuthPort } from '../../domain/ports/auth.port';
import argon2 from 'argon2';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly authPort: AuthPort) {}

  async execute(name: string, password: string) {
    const nameExists = await this.authPort.findUser(undefined, name);
    console.log(nameExists);
    if (nameExists?.name === name) {
      throw new ConflictException('Name already exists');
    }

    const hashedPassword = await argon2.hash(password);

    const user = await this.authPort.createUser(name, hashedPassword);

    const { password: _password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
