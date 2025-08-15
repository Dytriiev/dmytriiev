import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { DateInterceptor } from './interceptors/date.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle('Api')
  .setTitle('Api')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  if (!document.components) {
  document.components = {};
}
 document.components = {
    ...document.components,
    securitySchemes: {
      'x-api-key': {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Введите API ключ',
      },
    },
  };

   document.security = [{ 'x-api-key': [] }];
  SwaggerModule.setup('docs', app, document);
  app.useGlobalGuards(new AuthGuard( new Reflector()))
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new DateInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  async function shutDown( signal:string) {
     console.log('🔄  Shutting down gracefully...');
    await app.close().then( ()=>{
          console.log(`Bye tea‑lovers 👋 Received ${signal}` )
          process.exit(0)
    }
    )
    console.log(`Bye tea‑lovers 👋 Received ${signal}`);
    setTimeout(() => process.exit(1), 10_000).unref();
  }
  process.on('SIGTERM', () => shutDown('SIGTERM'));
  process.on('SIGINT', () => shutDown('SIGINT'));
}
bootstrap();