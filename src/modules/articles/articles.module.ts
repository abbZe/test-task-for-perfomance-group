import { Module } from '@nestjs/common';
import { ArticlesController } from './controllers/articles.controller';
import { PublicArticlesController } from './controllers/public-articles.controller';
import { IsArticleExistByTitlePipe } from './pipes/is-article-exist-by-title.pipe';
import { IsArticleExistByIdPipe } from './pipes/is-article-exist-by-id.pipe';
import { IsArticlePublicByIdPipe } from './pipes/is-article-public-by-id.pipe';
import { IsArticleAuthorExistByIdPipe } from './pipes/is-article-author-exist-by-id.pipe';

@Module({
  controllers: [ArticlesController, PublicArticlesController],
  providers: [
    IsArticleExistByTitlePipe,
    IsArticleExistByIdPipe,
    IsArticleAuthorExistByIdPipe,
    IsArticlePublicByIdPipe,
  ],
})
export class ArticlesModule {}
