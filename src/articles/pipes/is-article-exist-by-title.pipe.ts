import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { plainToInstance } from 'class-transformer';
import { FindArticleByTitleDto } from '../dtos/find-article-by-title.dto';
import { validate } from 'class-validator';

@Injectable()
export class IsArticleExistByTitlePipe implements PipeTransform {
  constructor(private readonly articlesService: ArticlesService) {}

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

    const articleExists = await this.articlesService.findOneByTitle(
      findArticleByTitleDto,
    );

    if (articleExists) {
      throw new ConflictException('Article with this title already exists');
    }

    return value;
  }
}
