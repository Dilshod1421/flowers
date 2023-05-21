import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function startApp() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.API_PORT || 3000;
    app.useGlobalPipes(new ValidationPipe());
    const config = new DocumentBuilder()
      .setTitle('Flowers')
      .setDescription('Flowers API')
      .setVersion('1.0')
      .addTag('nodejs', 'nestjs')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT, () =>
      console.log('Server listening on port', +PORT),
    );
  } catch (error) {
    console.log(error);
  }
}
startApp();
