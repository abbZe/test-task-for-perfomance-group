import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsUUID } from 'class-validator';

type TFindArticleByIdDto = Prisma.ArticleGetPayload<{
  select: {
    id: true;
  };
}>;

export class FindArticleByIdDto implements TFindArticleByIdDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
