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
    console.log('params', params);

    const isPriceSorting = params.orderBy && 'price' in params.orderBy;

    const isPopularitySorting =
      params.orderBy && 'popularity' in params.orderBy;

    const sortDirection = isPriceSorting
      ? params.orderBy.price === 'asc'
        ? 1
        : -1
      : isPopularitySorting
        ? params.orderBy.popularity === 'asc'
          ? 1
          : -1
        : 1;

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
          variants: {
            orderBy: {
              price: sortDirection === 1 ? 'asc' : 'desc',
            },
          },
          reviews: true,
        },
      }),
      this.prisma.product.count({
        where: {
          ...params.where,
          isActive: true,
        },
      }),
    ]);

    if (isPriceSorting) {
      const sortedProducts = products.sort((a, b) => {
        // Get effective price for product A
        const priceA =
          a.hasVariants && a.variants.length > 0
            ? a.variants[0].discountedPrice || a.variants[0].price // Use discounted price if available
            : a.discountedPrice || a.price; // Use product's discounted price if available

        const priceB =
          b.hasVariants && b.variants.length > 0
            ? b.variants[0].discountedPrice || b.variants[0].price
            : b.discountedPrice || b.price;

        return (priceA - priceB) * sortDirection;
      });

      return {
        data: sortedProducts,
        total,
      };
    }

    if (isPopularitySorting) {
      const sortedProducts = products.sort((a, b) => {
        // Calculate average rating from reviews
        const ratingA =
          a.reviews.length > 0
            ? a.reviews.reduce((sum, review) => sum + review.rating, 0) /
              a.reviews.length
            : 0;

        const ratingB =
          b.reviews.length > 0
            ? b.reviews.reduce((sum, review) => sum + review.rating, 0) /
              b.reviews.length
            : 0;

        // If ratings are equal, sort by number of reviews (more reviews = higher popularity)
        if (ratingA === ratingB) {
          return (a.reviews.length - b.reviews.length) * sortDirection;
        }

        return (ratingA - ratingB) * sortDirection;
      });

      return {
        data: sortedProducts,
        total,
      };
    }

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
