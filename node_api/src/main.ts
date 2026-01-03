import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { HttpLoggingInterceptor } from './shared/interceptors/http-logging.interceptor';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const appPrefix = 'api';
  const PORT = Number(process.env.PORT ?? 9999);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix(appPrefix);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Zod DTO validation (Body/Query/Param DTO)
  app.useGlobalPipes(new ZodValidationPipe());

  // Global exception formatting
  app.useGlobalFilters(new AllExceptionsFilter());

  // Request logging
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  app.enableShutdownHooks();

  // DB connection check
  const conn = app.get<Connection>(getConnectionToken());
  await conn.asPromise();
  Logger.log('Database connected successfully.', 'Bootstrap');

  await app.listen(PORT);
  Logger.log(
    `Server running! http://localhost:${PORT}/${appPrefix}`,
    'Bootstrap',
  );
}

bootstrap();
