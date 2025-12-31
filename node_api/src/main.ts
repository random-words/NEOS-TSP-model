import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

async function bootstrap() {
  const appPrefix = 'api';
  const PORT = process.env.PORT || 9999;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(appPrefix);

  const conn = app.get<Connection>(getConnectionToken());
  await conn.asPromise();

  await app.listen(PORT);
  console.log(`Database connected successfully.`);

  console.log(`Server running! http://localhost:${PORT}/${appPrefix}`);
}

bootstrap();
