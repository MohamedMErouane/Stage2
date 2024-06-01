// src/actualite.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActualiteDto } from './dto/create-actualite.dto';

@Injectable()
export class ActualiteService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.actualite.findMany();
  }

  async create(createActualiteDto: CreateActualiteDto) {
    const newActualite = {
      ...createActualiteDto, 
    };

    if (createActualiteDto.fileUrl) {
      newActualite.fileUrl = createActualiteDto.fileUrl; 
    }

    return this.prisma.actualite.create({
      data: newActualite,
    });
  }
}