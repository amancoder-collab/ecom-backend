import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientLogError } from 'src/common/helper/error_description';
import { Operation } from 'src/common/operations/operation.function';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart-item.dto';
import { Cart, CartItem, Product } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  async addItemToCart(cartId: string, dto: AddCartItemDto, userId: string) {
    const result = await this.prismaService.$transaction(async (prisma) => {
      const [existingUser, existingProduct] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
        }),
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

      if (!existingProduct.sizes.includes(dto.size)) {
        throw new BadRequestException('Invalid size for this product');
      }

      if (!existingProduct.colors.includes(dto.color)) {
        throw new BadRequestException('Invalid color for this product');
      }

      const existingCart = await prisma.cart.findFirst({
        where: {
          id: cartId,
        },
      });

      if (!existingCart) {
        throw new BadRequestException(ClientLogError.CART_NOT_EXIST);
      }

      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cartId,
          productId: dto.productId,
          size: dto.size,
          color: dto.color,
        },
      });

      console.log(existingCartItem, 'existingCartItem');

      if (existingCartItem) {
        const quantity = existingCartItem.quantity + dto.quantity;
        return prisma.cart.update({
          where: { id: cartId },
          data: {
            cartItems: {
              update: {
                data: {
                  quantity: quantity > 10 ? 10 : quantity,
                },
                where: {
                  id: existingCartItem.id,
                },
              },
            },
          },
          include: {
            cartItems: true,
          },
        });
      } else {
        return prisma.cart.update({
          where: { id: cartId },
          data: {
            cartItems: {
              create: {
                quantity: dto.quantity,
                productId: dto.productId,
                size: dto.size,
                color: dto.color,
              },
            },
          },
          include: {
            cartItems: true,
          },
        });
      }
    });

    return result;
  }

  async createCart(userId: string) {
    const existingCart = await this.prismaService.cart.findFirst({
      where: {
        userId: userId,
      },
    });

    if (existingCart) {
      throw new BadRequestException('Cart already exists');
    }

    return await this.prismaService.cart.create({
      data: {
        userId: userId,
      },
    });
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

  async removeItemFromCart(id: string, userId: string) {
    const cartItem = await this.prismaService.cart.findFirst({
      where: { id, userId: userId },
    });

    if (!cartItem) {
      throw new BadRequestException(ClientLogError.CART_NOT_EXIST);
    }

    return await this.prismaService.cart.update({
      where: { id },
      data: {
        cartItems: {
          delete: {
            id: id,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    const cart = await this.prismaService.cart.findFirst({
      where: {
        userId: userId,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
        billingAddress: true,
        shippingAddress: true,
      },
    });

    if (!cart) {
      throw new NotFoundException(ClientLogError.CART_NOT_EXIST);
    }

    return cart;
  }

  async findByUserIdWithTotals(userId: string) {
    return await this.retrieveWithTotals(userId);
  }

  private async retrieveWithTotals(id: string): Promise<Cart> {
    const cart = await this.findByUserId(id);

    const totals = await this.calculateTotals(cart);

    return { ...cart, ...totals };
  }

  private async calculateTotals(cart: Cart & { cartItems: CartItem[] }) {
    console.log(JSON.stringify(cart, null, 2), 'cart');
    const cartItems = cart?.cartItems;

    if (cartItems.length === 0) {
      return {
        shipping_total: 0,
        total_items: 0,
        discount_total: 0,
        subtotal: 0,
        total: 0,
        refundable_amount: 0,
      };
    }

    const subtotal = this.calculateSubtotal(cartItems);

    const totalItems = cartItems?.reduce(
      (sum, item) => sum + item?.quantity,
      0,
    );

    return {
      discount_total: 0,
      subtotal: subtotal,
      total: subtotal,
      total_items: totalItems,
      refundable_amount: 0,
    };
  }

  private calculateSubtotal(lineItems: CartItem[]): number {
    return lineItems.reduce((sum, item: CartItem & { product: Product }) => {
      const itemPrice = item?.product?.discountedPrice || 0;
      return sum + itemPrice * item?.quantity;
    }, 0);
  }

  async updateCartItemQuantity(
    cartId: string,
    itemId: string,
    dto: UpdateCartItemQuantityDto,
    userId: string,
  ) {
    const cart = await this.prismaService.cart.findFirst({
      where: { id: cartId, userId: userId },
    });

    if (!cart) {
      throw new BadRequestException(ClientLogError.CART_NOT_EXIST);
    }

    const cartItem = await this.prismaService.cartItem.findFirst({
      where: { id: itemId, cartId: cartId },
    });

    if (!cartItem) {
      throw new BadRequestException('Cart item not found');
    }

    return await this.prismaService.cartItem.update({
      where: { id: itemId, cartId: cartId },
      data: {
        quantity: dto.quantity,
      },
    });
  }
}
