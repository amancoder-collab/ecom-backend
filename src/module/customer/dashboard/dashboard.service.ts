import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prismaService: PrismaService) {}

    async dashboard() {
        const [newArrivals, trending, bestSellers] = await Promise.all([
            this.prismaService.products.findMany({
                where: {
                    is_live: true,
                },
                select: {
                    images: true,
                    product_name: true,
                    price_without_gst: true,
                    descounted_prices: true,
                },
                orderBy: {
                    created_at: 'desc',
                },
                take: 12,
            }),

            this.prismaService.products.findMany({
                where: {
                    is_live: true,
                },
                select: {
                    images: true,
                    product_name: true,
                    price_without_gst: true,
                    descounted_prices: true,
                },
            }),

            this.prismaService.products.findMany({
                where: { is_live: true },
                select: {
                    images: true,
                    product_name: true,
                    price_without_gst: true,
                    descounted_prices: true,
                },
                // orderBy: {
                //   order: {
                //     _count: 'desc' // highest order count
                //   }
                // },
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
                created_at: true,
                user: {
                    select: {
                        first_name: true,
                    },
                },
            },
            take: 10,
        });

        return getReview;
    }
}
