import { UserEntity } from '../entities/auth.entity';

export abstract class AuthPort {
  abstract createUser(name: string, password: string): Promise<UserEntity>;
  abstract findUser(
    id?: string,
    name?: string,
  ): Promise<UserEntity | undefined | null>;
}
