import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ minLength: 5, maxLength: 20 })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  title: string;

  @ApiProperty({ minLength: 5, maxLength: 200 })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price: number;
}
