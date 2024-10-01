import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientLogError } from 'src/common/helper/error_description';
import { Operation } from 'src/common/operations/operation.function';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly operation: Operation,
  ) {}

  async addCart(dto: AddCartItemDto, userId: string) {
    const result = await this.prismaService.$transaction(async (prisma) => {
      const [existingUser, existingProduct] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.product.findUnique({ where: { id: dto.productId } }),
      ]);

      if (!existingUser) {
        throw new NotFoundException(ClientLogError.USER_NOT_FOUND);
      }

      if (!existingProduct) {
        throw new NotFoundException(ClientLogError.PRODUCT_NOT_FOUND);
      }

      if (dto.quantity <= 0) {
        throw new BadRequestException(ClientLogError.QUANTITY_CANT_BE_ZERO);
      }

      const existingCart = await prisma.cart.findFirst({
        where: {
          userId: userId,
          productId: dto.productId,
        },
      });

      if (existingCart) {
        return prisma.cart.update({
          where: { id: existingCart.id },
          data: {
            quantity: existingCart.quantity + dto.quantity,
          },
          include: {
            product: {
              select: {
                quantity: true,
                name: true,
                images: true,
              },
            },
          },
        });
      } else {
        return prisma.cart.create({
          data: {
            userId: userId,
            productId: dto.productId,
            quantity: dto.quantity,
          },
          include: {
            product: {
              select: {
                quantity: true,
                name: true,
                images: true,
              },
            },
          },
        });
      }
    });

    return result;
  }

  async removeFromCart(id: string, userId: string) {
    const cartItem = await this.prismaService.cart.findFirst({
      where: { id, userId: userId },
    });

    if (!cartItem) {
      throw new BadRequestException(ClientLogError.CART_NOT_EXIST);
    }

    return await this.prismaService.cart.delete({
      where: { id },
    });
  }

  async listAllCart(page: number = 1, limit: number = 10) {
    const { skip, take } = this.operation.calculatePagination(page, limit);
    const result = await this.prismaService.cart.findMany({
      skip,
      take,
      include: {
        product: {
          select: {
            name: true,
            images: true,
            priceWithoutTax: true,
            discountedPrice: true,
          },
        },
      },
    });
    return result;
  }

  async listCartCount(userId: string) {
    const result = await this.prismaService.cart.count({
      where: {
        userId: userId,
      },
    });
    return result;
  }
}
