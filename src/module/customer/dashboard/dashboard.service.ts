import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async dashboard() {
    const [newArrivals, trending, bestSellers] = await Promise.all([
      this.prismaService.product.findMany({
        where: {
          isLive: true,
        },
        select: {
          images: true,
          name: true,
          priceWithoutTax: true,
          discountedPrice: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 12,
      }),

      this.prismaService.product.findMany({
        where: {
          isLive: true,
        },
        select: {
          images: true,
          name: true,
          priceWithoutTax: true,
          discountedPrice: true,
        },
      }),

      this.prismaService.product.findMany({
        where: { isLive: true },
        select: {
          images: true,
          name: true,
          priceWithoutTax: true,
          discountedPrice: true,
        },
        take: 8,
      }),
    ]);

    return {
      trending: trending,
      best_seller: bestSellers,
      new_arrival: newArrivals,
    };
  }
  async testimonials() {
    const getReview = await this.prismaService.review.findMany({
      where: {
        rating: 5,
      },
      select: {
        comments: true,
        rating: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
          },
        },
      },
      take: 10,
    });

    return getReview;
  }
}
