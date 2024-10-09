import { Injectable, NotFoundException } from '@nestjs/common';
import { Operation } from 'src/common/operations/operation.function';
import { PaginateQueryDto } from 'src/lib/pagination/dto/paginate-query.dto';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private operation: Operation,
  ) {}

  async getAllProducts(query: PaginateQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const { skip, take } = this.operation.calculatePagination(page, limit);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reviews: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
