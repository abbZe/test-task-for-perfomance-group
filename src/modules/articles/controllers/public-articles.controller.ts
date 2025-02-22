import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { IsArticleExistByIdPipe } from '../pipes/is-article-exist-by-id.pipe';
import { createArticlesFilter } from '../dtos/articles-filter.factory';
import { FindArticlesDto } from '../dtos/find-articles.dto';
import { IsArticlePublicByIdPipe } from '../pipes/is-article-public-by-id.pipe';
import { PrismaService } from '../../../core/db/db.service';

@Controller('public')
export class PublicArticlesController {
  constructor(private readonly prisma: PrismaService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id', IsArticleExistByIdPipe, IsArticlePublicByIdPipe) id: string,
  ) {
    return this.prisma.article.findUnique({
      where: {
        id,
      },
    });
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
}
