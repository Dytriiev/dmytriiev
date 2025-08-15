import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BrewModel } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
imports: [
    ThrottlerModule.forRootAsync({
      useFactory: async () => [
        {
          // ttl: 60000,
          // limit: 2
           ttl: 1000, // 1 секунда (минимальное значение)
          limit: Number.MAX_SAFE_INTEGER, // Очень большое число (~9 квадриллионов)
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [BrewModel,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
