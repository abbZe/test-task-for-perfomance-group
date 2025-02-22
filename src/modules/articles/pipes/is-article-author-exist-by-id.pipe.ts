import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { plainToInstance } from 'class-transformer';
import { FindArticleByTitleDto } from '../dtos/find-article-by-title.dto';
import { validate } from 'class-validator';
import { PrismaService } from '../../../core/db/db.service';

@Injectable()
export class IsArticleAuthorExistByIdPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: CreateArticleDto) {
    const errors = [];

    const createArticleDtoInstance = plainToInstance(CreateArticleDto, value);
    const createArticleDtoErrors = await validate(createArticleDtoInstance);
    errors.push(...createArticleDtoErrors);

    const findArticleByTitleDto = plainToInstance(FindArticleByTitleDto, {
      title: value.title,
    });

    const findArticleByTitleDtoErrors = await validate(findArticleByTitleDto);
    errors.push(...findArticleByTitleDtoErrors);

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((error) => error.constraints).join(', '),
      );
    }

    const authorExist = await this.prisma.user.findUnique({
      where: {
        id: createArticleDtoInstance.authorId,
      },
    });

    if (!authorExist) {
      throw new BadRequestException('Author does not exist');
    }

    return value;
  }
}
