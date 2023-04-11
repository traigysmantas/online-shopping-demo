import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductResponseDto } from './dtos/product-response.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@ApiTags('products')
@Serialize(ProductResponseDto)
@UseGuards(AuthenticatedGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Create new product',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created.',
    type: ProductResponseDto,
  })
  @Post()
  createProduct(@Body() body: CreateProductDto, @Request() req) {
    const id = req.user.id;
    return this.productsService.create(body, id);
  }

  @ApiOperation({
    summary: 'Update product',
  })
  @ApiResponse({
    status: 201,
    description: 'Product updated.',
    type: ProductResponseDto,
  })
  @Patch('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    const product = await this.productsService.findUnique(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this product',
      );
    }

    return this.productsService.updateById(id, body);
  }

  @ApiOperation({
    summary: 'Delete product',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted.',
    type: ProductResponseDto,
  })
  @Delete('/:id')
  async removeProduct(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    const product = await this.productsService.findUnique(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this product',
      );
    }

    return this.productsService.removeById(id);
  }

  @ApiOperation({
    summary: 'Find product by id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Product found by id',
    type: ProductResponseDto,
  })
  @Get('/:id')
  async findProduct(@Param('id') id: string) {
    const product = await this.productsService.findUnique(id);

    if (!product) {
      throw new NotFoundException('product not found');
    }
  }

  @ApiOperation({
    summary: 'Find products by title.',
  })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Products found by title',
    type: ProductResponseDto,
    isArray: true,
  })
  @Get()
  findProductsByTitle(@Query('title') title?: string) {
    return this.productsService.findByTitle(title);
  }
}
