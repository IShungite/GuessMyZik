import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';

@Module({
  providers: [RoomsGateway, RoomsService, PrismaService],
})
export class RoomsModule { }
