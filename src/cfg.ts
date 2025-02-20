import { Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';

export const routingCfg: Routes = [
  {
    path: '/auth',
    module: AuthModule,
  },
  {
    path: '/articles',
    module: ArticlesModule,
  },
];
