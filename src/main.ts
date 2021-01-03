import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // configure swagger
  const options = new DocumentBuilder()
    .setTitle('Atheneum API')
    .setDescription('The API for the atheneum app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // configure validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
