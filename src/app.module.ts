import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RouterModule } from '@nestjs/core';
import { routingConfig } from './config';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RouterModule.register(routingConfig),
    DbModule,
    LoggerModule,

    AuthModule,
    UsersModule,
    ArticlesModule,
  ],
})
export class AppModule {}
