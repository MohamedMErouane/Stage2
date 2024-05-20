import { Module } from '@nestjs/common';
import { ActualiteController } from './actualite.controller';
import { ActualiteService } from './actualite.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ActualiteController],
  providers: [ActualiteService, PrismaService],
})
export class ActualitesModule {}
