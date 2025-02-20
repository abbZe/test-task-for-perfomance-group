import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Pagination {
  @IsInt()
  @Min(1)
  readonly current: number = 1;

  @IsInt()
  readonly size: number = 5;
}

export class ArticlesFilter {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  tags: string[];
}

export abstract class FindArticlesDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Pagination)
  readonly pagination: Pagination;

  @IsOptional()
  @ValidateNested()
  @Type(() => ArticlesFilter)
  abstract readonly filter?: ArticlesFilter;
}
