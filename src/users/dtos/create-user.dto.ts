import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'Name of user', required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Surname of user', required: false })
  @IsString()
  @IsOptional()
  surname: string;
}
