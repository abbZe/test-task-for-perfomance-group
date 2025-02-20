import { Routes } from '@nestjs/core';
import { AuthModule } from './core/auth/auth.module';
import { ArticlesModule } from './modules/articles/articles.module';

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
