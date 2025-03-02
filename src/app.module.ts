import { Module } from '@nestjs/common';
import { DbModule } from './core/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { routingCfg } from './cfg';
import { ArticlesModule } from './modules/articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RouterModule.register(routingCfg),
    DbModule,

    AuthModule,
    ArticlesModule,
  ],
})
export class AppModule {}
