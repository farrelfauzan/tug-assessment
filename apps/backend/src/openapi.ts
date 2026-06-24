import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'node:fs/promises';
import { stringify } from 'yaml';
import { AppModule } from './app.module';

async function generateOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });

  const config = new DocumentBuilder()
    .setTitle('Wellness Package Management API')
    .setDescription('Admin and mobile API endpoints')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yaml = stringify(document);
  await writeFile('openapi.yaml', yaml, 'utf8');

  await app.close();
}

void generateOpenApi();
