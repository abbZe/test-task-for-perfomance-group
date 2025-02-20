import {
  Injectable,
  PipeTransform,
  BadRequestException,
  NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { ArticlesService } from '../services/articles.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindArticleByIdDto } from '../dtos/find-article-by-id.dto';

@Injectable()
export class IsArticlePublicByIdPipe implements PipeTransform {
  constructor(private readonly articlesService: ArticlesService) {}

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

    const articleExists = await this.articlesService.findOne(
      findArticleDtoInstance,
    );

    if (!articleExists) {
      throw new NotFoundException('Article not found');
    }

    if (articleExists && articleExists.isPublic === false) {
      throw new ForbiddenException('Article not public');
    }

    return id;
  }
}
