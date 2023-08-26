import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
  app.setViewEngine('hbs');
  const configService = app.get<ConfigService>(ConfigService);

  app.use(cookieParser());
  await app.listen(configService.get<number>('PORT') ?? 3000);
}

bootstrap();
