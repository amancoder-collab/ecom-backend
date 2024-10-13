import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart, CartItem, Product } from '@prisma/client';
import { ClientLogError } from 'src/common/helper/error_description';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart-item.dto';
import { ShippingService } from 'src/shipping/shipping.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => ShippingService))
    private readonly shippingService: ShippingService,
  ) {}

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

  async removeItemFromCart(cartId: string, itemId: string, userId: string) {
    const cartItem = await this.prismaService.cart.findFirst({
      where: { id: cartId, userId: userId },
    });

    if (!cartItem) {
      throw new BadRequestException(ClientLogError.CART_NOT_EXIST);
    }

    return await this.prismaService.cart.update({
      where: { id: cartId },
      data: {
        cartItems: {
          delete: {
            id: itemId,
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

  async findById(cartId: string) {
    const cart = await this.prismaService.cart.findUnique({
      where: {
        id: cartId,
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

  async updateAddress(cartId: string, userId: string, dto: CreateAddressDto) {
    const existingCart = await this.prismaService.cart.findUnique({
      where: { id: cartId },
      include: { shippingAddress: true, billingAddress: true },
    });

    if (!existingCart) {
      throw new NotFoundException('Cart not found');
    }

    let shippingAddress, billingAddress;

    if (existingCart.shippingAddress) {
      shippingAddress = await this.prismaService.address.update({
        where: { id: existingCart.shippingAddress.id },
        data: {
          firstName: dto.shipping.firstName,
          lastName: dto.shipping.lastName,
          address: dto.shipping.address,
          email: dto.shipping.email,
          address2: dto.shipping.address2,
          phone: dto.shipping.phone,
          city: dto.shipping.city,
          state: dto.shipping.state,
          country: dto.shipping.country,
          pincode: dto.shipping.pincode,
        },
      });
    } else {
      shippingAddress = await this.prismaService.address.create({
        data: {
          userId,
          firstName: dto.shipping.firstName,
          lastName: dto.shipping.lastName,
          email: dto.shipping.email,
          address2: dto.shipping.address2,
          phone: dto.shipping.phone,
          address: dto.shipping.address,
          city: dto.shipping.city,
          state: dto.shipping.state,
          country: dto.shipping.country,
          pincode: dto.shipping.pincode,
        },
      });
    }

    if (dto.billing_same_as_shipping) {
      billingAddress = shippingAddress;
    } else {
      if (
        existingCart.billingAddress &&
        existingCart.billingAddress.id !== shippingAddress.id
      ) {
        billingAddress = await this.prismaService.address.update({
          where: { id: existingCart.billingAddress.id },
          data: {
            firstName: dto.billing.firstName,
            lastName: dto.billing.lastName,
            email: dto.billing.email,
            address2: dto.billing.address2,
            phone: dto.billing.phone,
            address: dto.billing.address,
            city: dto.billing.city,
            state: dto.billing.state,
            country: dto.billing.country,
            pincode: dto.billing.pincode,
          },
        });
      } else {
        billingAddress = await this.prismaService.address.create({
          data: {
            userId,
            firstName: dto.billing.firstName,
            lastName: dto.billing.lastName,
            email: dto.billing.email,
            address2: dto.billing.address2,
            phone: dto.billing.phone,
            address: dto.billing.address,
            city: dto.billing.city,
            state: dto.billing.state,
            country: dto.billing.country,
            pincode: dto.billing.pincode,
          },
        });
      }
    }

    return await this.prismaService.cart.update({
      where: { id: cartId },
      data: {
        shippingAddress: {
          connect: { id: shippingAddress.id },
        },
        billingAddress: {
          connect: { id: billingAddress.id },
        },
      },
      include: {
        shippingAddress: true,
        billingAddress: true,
      },
    });
  }
}
