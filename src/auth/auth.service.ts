import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUnique({ email });

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) return null;

    return user;
  }
}
