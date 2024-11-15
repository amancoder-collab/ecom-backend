import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ClientLogError } from 'src/common/helper/error_description';
import { Pagination } from 'src/lib/pagination/paginate';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getVariantById(variantId: string) {
    return this.prismaService.productVariant.findUnique({
      where: { id: variantId },
      include: {
        attributeValues: {
          include: {
            attribute: true,
          },
        },
      },
    });
  }

  async createVariant(dto: CreateVariantDto, productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(ClientLogError.PRODUCT_NOT_FOUND);
    }

    const variant = await this.prismaService.productVariant.create({
      data: {
        height: dto.height,
        length: dto.length,
        sku: dto.sku,
        thumbnail: dto.thumbnail,
        width: dto.width,
        stock: dto.stock,
        weight: dto.weight,
        images: dto.images,
        price: dto.price,
        discountedPrice: dto.discountedPrice,
        product: {
          connect: {
            id: product.id,
          },
        },
        attributeValues: {
          create: dto.attributes.map((attr) => ({
            value: attr.value,
            attribute: {
              create: {
                product: {
                  connect: {
                    id: product.id,
                  },
                },
                title: attr.title,
              },
            },
          })),
        },
      },
    });

    return variant;
  }

  async updateVariant(
    dto: UpdateVariantDto,
    variantId: string,
    productId: string,
  ) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(ClientLogError.PRODUCT_NOT_FOUND);
    }

    const variant = await this.prismaService.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return this.prismaService.productVariant.update({
      where: { id: variantId },
      data: {
        height: dto.height,
        length: dto.length,
        sku: dto.sku,
        thumbnail: dto.thumbnail,
        width: dto.width,
        stock: dto.stock,
        weight: dto.weight,
        images: dto.images,
        attributeValues: {
          create: dto.attributes.map((attr) => ({
            value: attr.value,
            attribute: {
              create: {
                product: {
                  connect: {
                    id: product.id,
                  },
                },
                title: attr.title,
              },
            },
          })),
        },
      },
    });
  }

  async deleteVariantById(variantId: string) {
    const ordersWithVariant = await this.prismaService.orderItem.findFirst({
      where: {
        variantId: variantId,
      },
    });

    if (ordersWithVariant?.id) {
      return this.prismaService.productVariant.update({
        where: { id: variantId },
        data: {
          isActive: false,
          stock: 0,
          updatedAt: new Date(),
        },
      });
    } else {
      return this.prismaService.productVariant.delete({
        where: { id: variantId },
      });
    }
  }

  async create(dto: CreateProductDto, sellerId: string) {
    const seller = await this.prismaService.user.findFirst({
      where: {
        id: sellerId,
        role: Role.ADMIN,
      },
    });

    if (!seller) {
      throw new NotFoundException(ClientLogError.ONLY_SELLER);
    }

    if (!dto.hasVariants) {
      if (!dto.weight) {
        throw new BadRequestException(
          'Weight is required when no variants are provided',
        );
      }

      if (!dto.width) {
        throw new BadRequestException(
          'Width is required when no variants are provided',
        );
      }

      if (!dto.height) {
        throw new BadRequestException(
          'Height is required when no variants are provided',
        );
      }

      if (!dto.length) {
        throw new BadRequestException(
          'Length is required when no variants are provided',
        );
      }

      if (!dto.price) {
        throw new BadRequestException(
          'Price is required when no variants are provided',
        );
      }

      if (!dto.thumbnail || !dto.images || dto.images.length === 0) {
        throw new BadRequestException(
          'Thumbnail and images are required when no variants are provided',
        );
      }
    } else {
      if (dto.variants.length === 0) {
        throw new BadRequestException('Variants are required');
      }
    }

    return await this.prismaService.$transaction(async (prisma) => {
      const product = await this.prismaService.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          hasVariants: dto.hasVariants,
          isActive: dto.isActive,
          ...(!dto.hasVariants && {
            price: dto.price,
            discountedPrice: dto.discountedPrice,
            weight: dto.weight,
            width: dto.width,
            height: dto.height,
            length: dto.length,
            stock: dto.stock,
            thumbnail: dto.thumbnail,
            images: dto.images,
          }),
          seller: {
            connect: {
              id: sellerId,
            },
          },
        },
      });

      if (dto.hasVariants) {
        const attributes = await Promise.all(
          dto.attributes.map((attr) =>
            prisma.productAttribute.create({
              data: {
                title: attr.title,
                product: {
                  connect: { id: product.id },
                },
              },
            }),
          ),
        );

        await Promise.all(
          dto.variants.map((variant) =>
            prisma.productVariant.create({
              data: {
                product: {
                  connect: {
                    id: product.id,
                  },
                },
                sku: variant.sku,
                weight: variant.weight,
                width: variant.width,
                height: variant.height,
                length: variant.length,
                thumbnail: variant.thumbnail,
                images: variant.images,
                stock: variant.stock,
                price: variant.price,
                isActive: variant.isActive,
                discountedPrice: variant.discountedPrice,
                attributeValues: {
                  create: variant.attributes.map((attr) => ({
                    value: attr.value,
                    attribute: {
                      connect: {
                        id: attributes.find((a) => a.title === attr.title)?.id,
                      },
                    },
                  })),
                },
              },
            }),
          ),
        );
      }

      return await prisma.product.findUnique({
        where: { id: product.id },
        include: {
          variants: {
            include: {
              attributeValues: {
                include: {
                  attribute: true,
                },
              },
            },
          },
          attributes: true,
        },
      });
    });
  }

  async getProductStock(productId: string, variantId?: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.hasVariants) {
      if (!variantId) {
        throw new BadRequestException('Variant ID required for this product');
      }
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }
      return variant.stock;
    }

    return product.stock;
  }

  async updateStock(productId: string, quantity: number, variantId?: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.hasVariants) {
      if (!variantId) {
        throw new BadRequestException('Variant ID required for this product');
      }
      return this.prismaService.productVariant.update({
        where: { id: variantId },
        data: { stock: { decrement: quantity } },
      });
    }

    return this.prismaService.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });
  }

  async update(dto: UpdateProductDto, sellerId: string, productId: string) {
    const seller = await this.prismaService.user.findFirst({
      where: { id: sellerId, role: Role.ADMIN },
    });

    if (!seller) {
      throw new NotFoundException(ClientLogError.ONLY_SELLER);
    }

    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return await this.prismaService.$transaction(async (prisma) => {
      await prisma.product.update({
        where: { id: productId },
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          discountedPrice: dto.discountedPrice,
          thumbnail: dto.thumbnail,
          images: dto.images,
          weight: dto.weight,
          width: dto.width,
          height: dto.height,
          length: dto.length,
        },
        include: {
          variants: true,
        },
      });

      if (dto.attributes) {
        await Promise.all(
          dto.attributes.map(async (attr) => {
            const existingAttribute = await prisma.productAttribute.findFirst({
              where: { title: attr.title },
            });

            if (existingAttribute) {
              await Promise.all(
                attr.values.map(async (e) => {
                  const existingAttributeValue =
                    await prisma.productAttributeValue.findFirst({
                      where: { value: e, attributeId: existingAttribute.id },
                    });

                  if (!existingAttributeValue) {
                    await prisma.productAttributeValue.create({
                      data: { value: e, attributeId: existingAttribute.id },
                    });
                  }
                }),
              );
            } else {
              await prisma.productAttribute.create({
                data: {
                  title: attr.title,
                  product: { connect: { id: productId } },
                  values: {
                    create: attr.values.map((e) => ({ value: e })),
                  },
                },
              });
            }
          }),
        );
      }

      if (dto.variants) {
        await Promise.all(
          dto.variants.map(async (variant) => {
            const attributeValues = await prisma.productAttributeValue.findMany(
              {
                where: {
                  value: {
                    in: variant.attributes.map((attr) => attr.value),
                  },
                },
              },
            );

            console.log('attribute Values found', attributeValues);

            if (variant.id) {
              await prisma.productVariant.update({
                where: { id: variant.id },
                data: {
                  sku: variant.sku,
                  weight: variant.weight,
                  width: variant.width,
                  height: variant.height,
                  length: variant.length,
                  stock: variant.stock,
                  thumbnail: variant.thumbnail,
                  images: variant.images,
                  price: variant.price,
                  discountedPrice: variant.discountedPrice,
                  attributeValues: {
                    connect: attributeValues.map((attr) => ({
                      id: attr.id,
                    })),
                  },
                },
              });
            } else {
              await prisma.productVariant.create({
                data: {
                  sku: variant.sku,
                  weight: variant.weight,
                  width: variant.width,
                  height: variant.height,
                  length: variant.length,
                  images: variant.images,
                  stock: variant.stock,
                  thumbnail: variant.thumbnail,
                  price: variant.price,
                  discountedPrice: variant.discountedPrice,
                  product: { connect: { id: productId } },
                  attributeValues: {
                    connect: attributeValues.map((attr) => ({
                      id: attr.id,
                    })),
                  },
                },
              });
            }
          }),
        );
      }
    });
  }

  async delete(productId: string, sellerId: string) {
    const seller = await this.prismaService.user.findFirst({
      where: {
        id: sellerId,
        role: Role.ADMIN,
      },
    });

    if (!seller) {
      throw new NotFoundException(ClientLogError.ONLY_SELLER);
    }

    return await this.prismaService.$transaction(async (prisma) => {
      await prisma.productAttributeValue.deleteMany({
        where: {
          attribute: {
            productId: productId,
          },
        },
      });

      await prisma.productAttribute.deleteMany({
        where: {
          productId: productId,
        },
      });

      await prisma.productVariant.deleteMany({
        where: {
          productId: productId,
        },
      });

      return await prisma.product.delete({
        where: {
          id: productId,
        },
      });
    });
  }

  async deactivateProduct(sellerId: string, productId: string) {
    const seller = await this.prismaService.user.findFirst({
      where: {
        id: sellerId,
        role: Role.ADMIN,
      },
    });
    if (!seller) {
      throw new NotFoundException(ClientLogError.ONLY_SELLER);
    }
    return await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async findAll(params: Pagination) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        ...params,
        where: {
          ...params.where,
          isActive: true,
        },
        include: {
          variants: true,
          seller: true,
          attributes: true,
        },
      }),
      this.prismaService.product.count({
        where: {
          ...params.where,
          isActive: true,
        },
      }),
    ]);
    return { data, total };
  }

  async findById(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: {
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
      },
    });

    if (!product) {
      throw new NotFoundException(ClientLogError.PRODUCT_NOT_FOUND);
    }

    return product;
  }
}
