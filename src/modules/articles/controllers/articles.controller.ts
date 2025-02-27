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
  NotFoundException,
} from '@nestjs/common';
import * as R from 'ramda';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { Article } from '@prisma/client';
import { IsArticleExistByTitlePipe } from '../pipes/is-article-exist-by-title.pipe';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt.guard';
import { IsArticleExistByIdPipe } from '../pipes/is-article-exist-by-id.pipe';
import { createArticlesFilter } from '../dtos/articles-filter.factory';
import { TAuthorizedReq } from '../../../core/auth/types';
import { FindArticlesDto } from '../dtos/find-articles.dto';
import { PatchArticleByIdDto } from '../dtos/patch-article-by-id.dto';
import { IsArticleAuthorExistByIdPipe } from '../pipes/is-article-author-exist-by-id.pipe';
import { PrismaService } from '../../../core/db/db.service';

@Controller('private')
export class ArticlesController {
  constructor(private readonly prisma: PrismaService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOne(
    @Body(IsArticleExistByTitlePipe, IsArticleAuthorExistByIdPipe)
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', IsArticleExistByIdPipe) id: string) {
    return this.prisma.article.findUnique({
      where: {
        id,
      },
    });
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

    const elements = await this.prisma.article.count({
      where,
    });

    const pages = Math.ceil(elements / pagination?.size);

    if (pages !== 0 && pagination.current > pages) {
      throw new NotFoundException('Page not found');
    }

    const page =
      elements > 0
        ? await this.prisma.article.findMany({
            where,
            take: pagination.size,
            skip: pagination.size * (pagination.current - 1),
          })
        : [];

    return {
      pagination: {
        pages,
        elements,
        current: pagination.current,
        size: pagination.size,
      },
      page,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchOne(
    @Param('id', IsArticleExistByIdPipe) id: string,
    @Body() patchArticleByIdDto: PatchArticleByIdDto,
  ): Promise<Partial<PatchArticleByIdDto>> {
    const selected = R.pipe<
      Array<Partial<PatchArticleByIdDto>>,
      Partial<PatchArticleByIdDto>,
      Partial<PatchArticleByIdDto>
    >(
      R.pick(['title', 'description', 'tags', 'isPublic']),
      R.reject(R.isNil),
    )(patchArticleByIdDto);

    return this.prisma.article.update({
      where: {
        id,
      },
      data: {
        ...selected,
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id', IsArticleExistByIdPipe) id: string) {
    return this.prisma.article.delete({
      where: {
        id,
      },
    });
  }
}
