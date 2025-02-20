import {
  BadRequestException,
  Body,
  Controller,
  Request,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import * as R from 'ramda';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { ArticlesService } from '../services/articles.service';
import { Article } from '@prisma/client';
import { IsArticleExistByTitlePipe } from '../pipes/is-article-exist-by-title.pipe';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { IsArticleExistByIdPipe } from '../pipes/is-article-exist-by-id.pipe';
import { createArticlesFilter } from '../dtos/articles-filter.factory';
import { TAuthorizedReq } from '../../auth/types';
import { FindArticlesDto } from '../dtos/find-articles.dto';
import { PatchArticleByIdDto } from '../dtos/patch-article-by-id.dto';

@Controller('private')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(
    @Body(IsArticleExistByTitlePipe) createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return await this.articlesService.createOne(createArticleDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', IsArticleExistByIdPipe) id: string) {
    return await this.articlesService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(
    @Body() findArticlesDto: FindArticlesDto,
    @Request() req: TAuthorizedReq,
  ) {
    const { pagination, filter } = findArticlesDto;

    if (pagination.current < 1) {
      throw new BadRequestException(
        'Invalid page number, must be greater than 0',
      );
    }

    const where = createArticlesFilter({ id: req.user.id, filter });

    return this.articlesService.findMany(where, pagination);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchOne(
    @Param('id', IsArticleExistByIdPipe) id: string,
    @Body() patchArticleByIdDto: PatchArticleByIdDto,
  ) {
    const select = R.pipe<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      Partial<PatchArticleByIdDto>,
      Partial<PatchArticleByIdDto>
    >(
      R.pick(['title', 'description', 'tags', 'isPublic']),
      R.reject(R.isNil),
    )(patchArticleByIdDto);

    return await this.articlesService.patchOne(id, select);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id', IsArticleExistByIdPipe) id: string) {
    return await this.articlesService.deleteOne({ id });
  }
}
