import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { IsArticleExistByIdPipe } from '../pipes/is-article-exist-by-id.pipe';
import { createArticlesFilter } from '../dtos/articles-filter.factory';
import { FindArticlesDto } from '../dtos/find-articles.dto';
import { IsArticlePublicByIdPipe } from '../pipes/is-article-public-by-id.pipe';

@Controller('public')
export class PublicArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id', IsArticleExistByIdPipe, IsArticlePublicByIdPipe) id: string,
  ) {
    return await this.articlesService.findOne({ id });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findPublicArticles(@Body() findArticlesDto: FindArticlesDto) {
    const { pagination, filter } = findArticlesDto;

    if (pagination.current < 1) {
      throw new BadRequestException(
        'Invalid page number, must be greater than 0',
      );
    }

    const where = createArticlesFilter({ filter, isPublic: true });

    return this.articlesService.findMany(where, pagination);
  }
}
