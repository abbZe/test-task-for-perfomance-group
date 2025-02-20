import { Prisma } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

type TCreateArticleDto = Prisma.ArticleGetPayload<{
  select: {
    authorId: true;
    title: true;
    description: true;
    tags: true;
  };
}>;

export class CreateArticleDto implements TCreateArticleDto {
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
