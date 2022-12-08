import {
  Controller, Get, Post, Body, Patch, Param, Request, UseGuards, BadRequestException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll({});
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body('updateUserDto') updateUserDto: Prisma.UserUpdateInput,
    @Body('oldPassword') oldPassword?: string,
  ) {
    if (updateUserDto.password) {
      const checkPassword = await this.usersService
        .checkPassword(oldPassword, req.user.id);
      if (!checkPassword) {
        throw new BadRequestException('Password mismatch');
      }
    }
    return this.usersService.update({ where: { id }, data: updateUserDto });
  }
}
