import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  providers: [ProductsService, ProductsRepository],
  imports: [PrismaModule],
  controllers: [ProductsController],
})
export class ProductsModule {}
