import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
// import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
// import { FileService } from './file.service';
import { LimitService } from './limit.service';
import { AppService } from './app.service';
import { FileService } from './file.service';

@Controller('zip')
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(private readonly appService: FileService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return this.appService.upload(files);
  }
}
