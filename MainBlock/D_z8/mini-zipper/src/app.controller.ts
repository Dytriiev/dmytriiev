import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
// import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
// import { FileService } from './file.service';
import { LimitService } from './limit.service';

@Controller('zip')
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(private readonly appService: LimitService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.appService.upload(file);
  }
}
