import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

type TFindArticleByTitleDto = Prisma.ArticleGetPayload<{
  select: {
    title: true;
  };
}>;

export class FindArticleByTitleDto implements TFindArticleByTitleDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
