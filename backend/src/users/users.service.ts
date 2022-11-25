import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
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
      data: Prisma.UserUpdateInput;
    },
  ): Promise<User> {
    const { password } = data;
    const hashedPassword = password ? await this.hashPwd(password as string) : undefined;
    return this.prisma.user.update({
      where,
      data: { ...data, password: hashedPassword },
    });
  }

  async hashPwd(password: string) {
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
  }

  async checkPassword(oldPassword: string, newPassword: string, id: string) {
    const dbPassword = await this.prisma.user.findUnique({
      where: { id }, select: { password: true },
    });
    const result = await compare(oldPassword, dbPassword.password);
    return result;
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}
