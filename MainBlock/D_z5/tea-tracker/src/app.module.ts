import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BrewModel } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [ ]
    })
  ],

  controllers: [AppController],
  providers: [BrewModel],
})
export class AppModule {}
