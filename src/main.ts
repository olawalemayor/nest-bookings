import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import * as client from 'prom-client';
import { MetricsMiddleware } from './metrics/metrics.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '1mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Metrics defaults
  client.collectDefaultMetrics();
  app.use(MetricsMiddleware);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`HTTP listening on :${port}`);
}
bootstrap();
