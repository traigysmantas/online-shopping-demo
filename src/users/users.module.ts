import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersRepository],
  imports: [PrismaModule],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
