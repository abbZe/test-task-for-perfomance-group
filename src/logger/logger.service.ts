import { Injectable } from '@nestjs/common';
import {
  createLogger as createWinstonLogger,
  transports,
  format,
} from 'winston';

@Injectable()
export class LoggerService {
  createDevelopLogger() {
    return createWinstonLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.colorize(),
            format.printf(({ level, message, timestamp, ...meta }) => {
              return `${timestamp} [${level}]: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta) : ''
              }`;
            }),
          ),
        }),
      ],
    });
  }

  createProdLogger() {
    return createWinstonLogger({
      level: 'info',
      transports: [
        new transports.File({
          filename: 'logs/combined.log',
          format: format.combine(format.timestamp(), format.json()),
        }),
        new transports.File({
          level: 'error',
          filename: 'logs/error.log',
          format: format.combine(format.timestamp(), format.json()),
        }),
      ],
    });
  }

  async createLogger({ forceDevelop = false } = {}) {
    const isProduction = process.env.NODE_ENV === 'production' && !forceDevelop;
    return isProduction ? this.createProdLogger() : this.createDevelopLogger();
  }
}
