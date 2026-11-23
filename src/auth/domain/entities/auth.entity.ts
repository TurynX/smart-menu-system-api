export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly password: string,
    public readonly role: string,
    public readonly createdAt: Date,
  ) {}
}
