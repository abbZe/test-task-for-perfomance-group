import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../db/db.service';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { DeleteArticleDto } from '../dtos/delete-article.dto';
import { FindArticleByIdDto } from '../dtos/find-article-by-id.dto';
import { FindArticleByTitleDto } from '../dtos/find-article-by-title.dto';
import { TArticlesWhere } from '../dtos/articles-filter.factory';
import { PatchArticleByIdDto } from '../dtos/patch-article-by-id.dto';
import { FindArticlesDto } from '../dtos/find-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  public async createOne(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
      },
    });
  }

  public async deleteOne(deleteArticleDto: DeleteArticleDto) {
    return this.prisma.article.delete({
      where: {
        ...deleteArticleDto,
      },
    });
  }

  public async findOne(findArticleDto: FindArticleByIdDto) {
    return this.prisma.article.findUnique({
      where: {
        ...findArticleDto,
      },
    });
  }

  public async findOneByTitle(findArticleByTitleDto: FindArticleByTitleDto) {
    return this.prisma.article.findUnique({
      where: {
        ...findArticleByTitleDto,
      },
    });
  }

  public async findMany(
    where: TArticlesWhere,
    pagination: FindArticlesDto['pagination'],
  ) {
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

  public async patchOne(
    id: string,
    patchArticleByIdDto: Partial<PatchArticleByIdDto>,
  ) {
    return this.prisma.article.update({
      where: {
        id,
      },
      data: {
        ...patchArticleByIdDto,
      },
    });
  }
}
