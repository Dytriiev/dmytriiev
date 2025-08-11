import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { FileService } from './file.service';
import { AppService } from './app.service';
import { LimitService } from './limit.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [FileService, AppService, LimitService],
})
export class AppModule {}
