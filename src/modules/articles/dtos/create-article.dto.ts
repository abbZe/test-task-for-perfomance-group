import { Prisma } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

type TCreateArticleDto = Prisma.ArticleGetPayload<{
  select: {
    authorId: true;
    title: true;
    description: true;
    tags: true;
  };
}>;

export class CreateArticleDto implements TCreateArticleDto {
  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
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
