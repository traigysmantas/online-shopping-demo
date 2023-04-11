import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  userId: string;
}
