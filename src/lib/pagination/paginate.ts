import { Prisma } from '@prisma/client';
import { PaginateQueryDto } from './dto/paginate-query.dto';
export interface Pagination {
  take?: number;
  skip?: number;
  orderBy?: Prisma.JsonObject;
  where?: Prisma.JsonObject;
}
export const paginate = (query: PaginateQueryDto) => {
  const paginationParams: Pagination = {
    skip: 0,
    take: 10,
    orderBy: {},
    where: {
      // deletedAt: null,
    },
  };

  paginationParams.take = query.limit
    ? parseInt(query.limit.toString(), 10)
    : 10;
  paginationParams.skip = query.page
    ? (parseInt(query.page.toString(), 10) - 1) * paginationParams.take
    : 0;

  const searchFields = query.searchFields ? query.searchFields.split(',') : [];
  const search = query.search ? query.search : '';

  // if (search && searchFields.length) {
  //   paginationParams.where = {
  //     OR: searchFields.map((field) =>
  //       field === 'role' || field.includes('select:') || field.includes('bool:')
  //         ? {
  //             [field.replace('select:', '').replace('bool:', '')]: {
  //               equals: field.includes('bool:')
  //                 ? search === 'true'
  //                   ? true
  //                   : false
  //                 : search,
  //             },
  //           }
  //         : { [field]: { contains: search, mode: 'insensitive' } },
  //     ),
  //   };
  // }

  if (search && searchFields.length) {
    paginationParams.where = {
      OR: searchFields.map((field) => {
        if (field.includes('.')) {
          const parts = field.split('.');
          let nestedQuery: any = { contains: search, mode: 'insensitive' };
          for (let i = parts.length - 1; i >= 0; i--) {
            nestedQuery = { [parts[i]]: nestedQuery };
          }
          return nestedQuery;
        } else if (
          field === 'role' ||
          field.includes('select:') ||
          field.includes('bool:')
        ) {
          return {
            [field.replace('select:', '').replace('bool:', '')]: {
              equals: field.includes('bool:')
                ? selectParser(search)
                : search === 'null'
                  ? null
                  : isNaN(parseInt(search))
                    ? search
                    : parseInt(search),
            },
          };
        } else {
          return { [field]: { contains: search, mode: 'insensitive' } };
        }
      }),
    };
  }

  if (query.sort) {
    const sort = query.sort.split(',');
    sort.forEach((s) => {
      const [key, value] = s.split(':') as [string, 'asc' | 'desc'];
      const keys = key.split('.');
      let orderBy = paginationParams.orderBy as Record<string, any>;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        orderBy[k] = orderBy[k] || {};
        orderBy = orderBy[k] as Record<string, any>;
      }
      orderBy[keys[keys.length - 1]] = value;
    });
  } else {
    paginationParams.orderBy = {
      createdAt: 'desc',
    };
  }

  return paginationParams;
};

export const paginatedResponse = <
  T extends {
    [key: string]: any;
  },
>(
  data: T[],
  count: number,
  paginate: Pagination,
) => {
  return {
    data: data,
    meta: {
      total: count,
      items: data.length,
      currentPage: paginate.skip / paginate.take + 1,
      perPage: paginate.take,
      lastPage: Math.ceil(count / paginate.take),
    },
  };
};

export class Paginate<T> {
  private paginationParameters: Pagination;
  constructor(private readonly query: PaginateQueryDto) {}

  public params() {
    this.paginationParameters = paginate(this.query);
    return this.paginationParameters;
  }

  public response(data: T[], count: number) {
    return paginatedResponse(data, count, this.paginationParameters);
  }
}

const selectParser = (search: string) => {
  if (search === 'true') return true;
  if (search === 'false') return false;
  if (search === 'null') return null;
  return isNaN(parseInt(search)) ? search : parseInt(search);
};
