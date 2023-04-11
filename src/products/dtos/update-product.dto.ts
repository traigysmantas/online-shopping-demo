import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ minLength: 5, maxLength: 20 })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(20)
  title: string;

  @ApiProperty({ minLength: 5, maxLength: 200 })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(200)
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsPositive()
  price: number;
}
