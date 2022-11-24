import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const saltRounds = 10;
    const myPlaintextPassword = data.password;
    const hashedPassword = await hash(myPlaintextPassword, saltRounds);

    if (hashedPassword) {
      try {
        return await this.prisma.user.create({
          data: {
            email: data.email,
            username: data.username,
            password: hashedPassword,
          },
        });
      } catch {
        throw new Error('User already exists');
      }
    }
    throw new Error('Failed to create user.');
  }

  async findAll(
    { where, orderBy }: {
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput
    },
  ): Promise<User[]> {
    return this.prisma.user.findMany({ where, orderBy });
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  async update(
    { where, data }: {
      where: Prisma.UserWhereUniqueInput;
      data: Prisma.UserUpdateInput
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}
