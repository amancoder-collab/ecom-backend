import { Injectable, NotFoundException } from '@nestjs/common';
import { Operation } from 'src/common/operations/operation.function';
import { PaginateQueryDto } from 'src/lib/pagination/dto/paginate-query.dto';
import { Pagination } from 'src/lib/pagination/paginate';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private operation: Operation,
  ) {}

  async getAllProducts(params: Pagination) {
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        ...params,
        where: {
          ...params.where,
          isActive: true,
        },
        include: {
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          variants: true,
        },
      }),
      this.prisma.product.count({
        where: {
          ...params.where,
          isActive: true,
        },
      }),
    ]);

    return {
      data: products,
      total,
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
        variants: {
          include: {
            attributeValues: {
              include: {
                attribute: true,
              },
            },
          },
        },
        attributes: {
          include: {
            values: true,
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
