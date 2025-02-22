import {
  Injectable,
  PipeTransform,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindArticleByIdDto } from '../dtos/find-article-by-id.dto';
import { PrismaService } from '../../../core/db/db.service';

@Injectable()
export class IsArticleExistByIdPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(id: string) {
    const errors = [];

    const findArticleDtoInstance = plainToInstance(FindArticleByIdDto, {
      id,
    });

    const findArticleDtoErrors = await validate(findArticleDtoInstance);
    errors.push(...findArticleDtoErrors);

    if (errors.length > 0) {
      throw new BadRequestException(errors.map((e) => e.constraints));
    }

    const articleExists = await this.prisma.article.findUnique({
      where: {
        ...findArticleDtoInstance,
      },
    });

    if (!articleExists) {
      throw new NotFoundException('Article not found');
    }

    return id;
  }
}
