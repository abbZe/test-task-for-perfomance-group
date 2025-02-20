import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { WinstonLogger } from './logger/winston.logger';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useLogger(new WinstonLogger(await app.get(LoggerService).createLogger()));

  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  /*
   * [DESC]: Отключил, чтобы легче было проверять тестовое
   * а то пришлось бы генерировать токен
  app.use(
    doubleCsrf({
      getSecret: () => 'very_secret_key',
      cookieName: '__another-knowledge-base-x-csrf-token',
      cookieOptions: {
        sameSite: true,
        httpOnly: true,
        domain: 'localhost',
        path: '/',
      },
      getTokenFromRequest: (req) => {
        const cookies = cookie.parse(req.headers.cookie || '');
        return cookies['__another-knowledge-base-x-csrf-token'];
      },
    }).doubleCsrfProtection,
  );
   */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
