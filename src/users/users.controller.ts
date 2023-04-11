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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Serialize(UserResponseDto)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created.',
    type: UserResponseDto,
  })
  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @ApiOperation({
    summary: 'Login with user credentials',
  })
  @ApiResponse({
    status: 201,
    description: 'User logged in.',
    type: UserResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req) {
    return req.user;
  }

  @ApiOperation({
    summary: 'Logout from the current session',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out.',
  })
  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
  }

  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Update user details',
  })
  @ApiResponse({
    status: 201,
    description: 'User details updated.',
    type: UserResponseDto,
  })
  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Request() req,
  ) {
    if (id !== req.user.id) {
      throw new ForbiddenException('cannot update another user');
    }
    return this.usersService.updateById(id, body);
  }

  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted.',
    type: UserResponseDto,
  })
  @Delete('/:id')
  removeUser(@Param('id') id: string, @Request() req) {
    if (id !== req.user.id) {
      throw new ForbiddenException('cannot delete another user');
    }
    return this.usersService.removeById(id);
  }

  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: 'Find user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'User found by id',
    type: UserResponseDto,
  })
  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findUnique({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @ApiOperation({
    summary: 'Search users by email',
  })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Users found by email',
    type: UserResponseDto,
    isArray: true,
  })
  @UseGuards(AuthenticatedGuard)
  @Get()
  findByEmail(@Query('email') email?: string) {
    return this.usersService.findByEmail(email);
  }
}
