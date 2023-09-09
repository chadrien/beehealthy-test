import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(),
    cors: process.env.NODE_ENV === 'development' ? true : false,
  });
  await app.listen(3000);
}
bootstrap();
