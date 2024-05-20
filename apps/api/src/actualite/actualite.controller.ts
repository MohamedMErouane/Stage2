// actualite.controller.ts

import { Controller, Get, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ActualiteService } from './actualite.service';
import { CreateActualiteDto } from './dto/create-actualite.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('/actualite')
export class ActualiteController {
  constructor(private readonly actualiteService: ActualiteService) {}

  @Get('/actualiteGet')
  findAll() {
    return this.actualiteService.findAll();
  }

  @Post('/actualite')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createActualiteDto: CreateActualiteDto,
  ) {
    if (file) {
      createActualiteDto.fileUrl = `/uploads/${file.filename}`;
    }
    return this.actualiteService.create(createActualiteDto);
  }
}
