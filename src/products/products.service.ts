import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async create(
    product: Pick<Product, 'title' | 'description' | 'price'>,
    userId: string,
  ): Promise<Product> {
    return this.productsRepository.create({
      ...product,
      user: { connect: { id: userId } },
    });
  }

  updateById(
    id: string,
    attrs: Partial<Pick<Product, 'title' | 'description' | 'price'>>,
  ): Promise<Product> {
    return this.productsRepository.update({ where: { id }, data: attrs });
  }

  removeById(id: string): Promise<Product> {
    return this.productsRepository.delete({ id });
  }

  findUnique(id: string): Promise<Product | null> {
    return this.productsRepository.findUnique({ id });
  }

  findByTitle(title?: string): Promise<Product[]> {
    const query = title
      ? {
          where: {
            OR: [
              { title: { contains: title } },
              { title: { startsWith: title } },
            ],
          },
        }
      : { where: { title } };

    return this.productsRepository.findMany(query);
  }
}
