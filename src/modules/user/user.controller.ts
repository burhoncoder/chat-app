import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { User } from './domain/user';

import { JwtAuthGuard } from '../auth/app/jwt/jwt.guard';

import { UserService } from './app/services/user.service';
import { CreateUserDto } from './app/dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update() {
    return 'update user';
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async changePassword() {
    return 'change password';
  }
}
