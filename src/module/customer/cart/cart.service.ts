import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { AddCart } from './dto/cart.dto';
import { ClientLogError } from 'src/common/helper/error_description';
import { Operation } from 'src/common/operations/operation.function';

@Injectable()
export class CartService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly operation: Operation,
    ) {}
    async addCart(dto: AddCart, UserId: string) {
        const result = await this.prismaService.$transaction(async (prisma) => {
            const [existingUser, existingProduct] = await Promise.all([
                prisma.user.findUnique({ where: { id: UserId } }),
                prisma.products.findUnique({ where: { id: dto.productId } }),
            ]);

            if (!existingUser) {
                throw new NotFoundException(ClientLogError.USER_NOT_FOUND);
            }

            if (!existingProduct) {
                throw new NotFoundException(ClientLogError.PRODUCT_NOT_FOUND);
            }

            if (dto.quantities <= 0) {
                throw new BadRequestException(
                    ClientLogError.QUANTITY_CANT_BE_ZERO,
                );
            }

            const existingCart = await prisma.cart.findFirst({
                where: {
                    user_id: UserId,
                    product_id: dto.productId,
                },
            });

            if (existingCart) {
                return prisma.cart.update({
                    where: { id: existingCart.id },
                    data: {
                        quantities: existingCart.quantities + dto.quantities,
                    },
                    include: {
                        products: {
                            select: {
                                quantities: true,
                                product_name: true,
                                images: true,
                            },
                        },
                    },
                });
            } else {
                return prisma.cart.create({
                    data: {
                        user_id: UserId,
                        product_id: dto.productId,
                        quantities: dto.quantities,
                    },
                    include: {
                        products: {
                            select: {
                                quantities: true,
                                product_name: true,
                                images: true,
                            },
                        },
                    },
                });
            }
        });

        return result;
    }

    async removeFromCart(id: string, UserId: string) {
        const cartItem = await this.prismaService.cart.findFirst({
            where: { id, user_id: UserId },
        });

        if (!cartItem) {
            throw new BadRequestException(ClientLogError.CART_NOT_EXIST);
        }

        return await this.prismaService.cart.delete({
            where: { id },
        });
    }

    async listAllCart(page: number = 1, limit: number = 10) {
        const { skip, take } = this.operation.calculatePagination(
            page,
            limit,
        );
        const result = await this.prismaService.cart.findMany({
            skip,
            take,
        });
        return result;
    }

    async listCartCount(UserId: string) {
        const result = await this.prismaService.cart.count({
            where: {
                user_id: UserId,
            },
        });
        return result;
    }
}
