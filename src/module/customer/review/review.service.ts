import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { ClientLogError } from 'src/common/helper/error_description';
import { Operation } from 'src/common/operations/operation.function';

@Injectable()
export class ReviewService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly operation: Operation,
    ) {}

    async postReview(dto: ReviewDto, UserId) {
        const [findProductId, findUserId] = await Promise.all([
            this.prismaService.products.findUnique({
                where: { id: dto.productId },
            }),
            this.prismaService.user.findUnique({
                where: { id: UserId },
            }),
        ]);

        if (!findProductId) {
            throw new BadRequestException(ClientLogError.PRODUCT_NOT_FOUND);
        }

        if (!findUserId) {
            throw new BadRequestException(ClientLogError.USER_NOT_FOUND);
        }

        const rating = dto.rating;

        if (isNaN(rating) || rating < 1 || rating > 5) {
            throw new BadRequestException(ClientLogError.RATING_MUST_BE_VALID);
        }

        const existingReview = await this.prismaService.review.findFirst({
            where: {
                user_id: UserId,
                product_id: dto.productId,
            },
        });

        if (existingReview) {
            const updatedReview = await this.prismaService.review.update({
                where: {
                    id: existingReview.id,
                },
                data: {
                    rating: dto?.rating,
                    comments: dto?.comment,
                    images: dto?.images,
                    product_id: dto?.productId,
                    user_id: UserId,
                },
            });

            return updatedReview;
        } else {
            const newReview = await this.prismaService.review.create({
                data: {
                    rating: dto.rating,
                    comments: dto.comment,
                    images: dto.images,
                    product_id: dto.productId,
                    user_id: UserId,
                },
            });

            return newReview;
        }
    }

    async findAll(page: number, limit: number) {
        const { skip, take } = this.operation.calculatePaginationOptimized(
            page,
            limit,
        );
        return await this.prismaService.review.findMany({ skip, take });
    }

    async findOneReview(UserId: string, productId: string) {
        const [findProductId, findUserId] = await Promise.all([
            this.prismaService.products.findUnique({
                where: { id: productId },
            }),
            this.prismaService.user.findUnique({
                where: { id: UserId },
            }),
        ]);

        if (!findProductId) {
            throw new BadRequestException(ClientLogError.PRODUCT_NOT_FOUND);
        }

        if (!findUserId) {
            throw new BadRequestException(ClientLogError.USER_NOT_FOUND);
        }

        const review = await this.prismaService.review.findMany({
            where: {
                product_id: productId,
            },
            select: {
                rating: true,
                comments: true,
                images: true,
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });

        return review;
    }
}
