import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

type TDeleteArticleDto = Prisma.ArticleGetPayload<{
  select: {
    id: true;
  };
}>;

export class DeleteArticleDto implements TDeleteArticleDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
