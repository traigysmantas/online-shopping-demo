import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(
    user: Pick<User, 'email' | 'password' | 'name' | 'surname'>,
  ): Promise<User> {
    // TODO: use salt string from env
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.usersRepository.create({
      ...user,
      ...{ password: hashedPassword },
    });
  }

  updateById(
    id: string,
    attrs: Partial<Pick<User, 'email' | 'password'>>,
  ): Promise<User> {
    return this.usersRepository.update({ where: { id }, data: attrs });
  }

  removeById(id: string): Promise<User> {
    return this.usersRepository.delete({ id });
  }

  findUnique({
    id,
    email,
  }:
    | { email: string; id?: never }
    | { id: string; email?: never }): Promise<User> {
    return this.usersRepository.findUnique({ id, email });
  }

  findByEmail(email?: string): Promise<User[]> {
    const query = email
      ? {
          where: {
            OR: [
              { email: { contains: email } },
              { email: { startsWith: email } },
            ],
          },
        }
      : { where: { email } };

    return this.usersRepository.findMany(query);
  }
}
