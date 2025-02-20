import { Prisma } from '@prisma/client';
import { ArticlesFilter } from './find-articles.dto';

export type TArticlesWhere = Prisma.ArticleWhereInput & {
  AND: Prisma.ArticleWhereInput[];
};

export const createArticlesFilter = ({
  id,
  filter,
  isPublic,
}: {
  id?: string;
  filter?: ArticlesFilter;
  isPublic?: boolean;
}): TArticlesWhere => {
  let where: TArticlesWhere = { AND: [] };

  if (id) {
    where = {
      AND: [
        {
          id,
        },
      ],
    };
  }

  if (isPublic) {
    where = {
      AND: [
        {
          isPublic: true,
        },
      ],
    };
  }

  if (filter && filter.tags) {
    where.AND.push({
      tags: {
        hasSome: filter.tags,
      },
    });
  }

  return where;
};
