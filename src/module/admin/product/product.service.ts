import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ClientLogError } from 'src/common/helper/error_description';
import { Operation } from 'src/common/operations/operation.function';
import { Pagination } from 'src/lib/pagination/paginate';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly operation: Operation,
  ) {}

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

    return await this.prismaService.$transaction(async (prisma) => {
      const product = await this.prismaService.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          tax: dto.tax,
          discountedPrice: dto.discountedPrice,
          thumbnail: dto.thumbnail,
          seller: {
            connect: {
              id: sellerId,
            },
          },
        },
      });

      const variants = await Promise.all(
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
              breadth: variant.breadth,
              height: variant.height,
              length: variant.length,
              thumbnail: variant.thumbnail,
              images: variant.images,
              stock: variant.stock,
              attributeValues: {
                create: variant.attributes.map((attr) => ({
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
          }),
        ),
      );

      const updatedProduct = await prisma.product.update({
        where: { id: product.id },
        data: {
          variants: {
            connect: variants.map((variant) => ({ id: variant.id })),
          },
        },
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

      return updatedProduct;
    });
  }

  async update(dto: UpdateProductDto, sellerId: string, productId: string) {
    const seller = await this.prismaService.user.findFirst({
      where: { id: sellerId, role: Role.ADMIN },
    });

    if (!seller) {
      throw new NotFoundException(ClientLogError.ONLY_SELLER);
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id: productId },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        tax: dto.tax,
        discountedPrice: dto.discountedPrice,
        thumbnail: dto.thumbnail,
        variants: {
          updateMany: dto.variants.map((variant) => ({
            where: { id: variant.id },
            data: {
              sku: variant.sku,
              color: variant.color,
              size: variant.size,
              weight: variant.weight,
              breadth: variant.breadth,
              height: variant.height,
              length: variant.length,
              images: variant.images,
              stock: variant.stock,
            },
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    return updatedProduct;
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
    return await this.prismaService.product.delete({
      where: {
        id: productId,
      },
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
        isLive: false,
      },
    });
  }

  async findAll(params: Pagination) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        ...params,
        where: {
          ...params.where,
          isLive: true,
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
          isLive: true,
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
        attributes: true,
      },
    });

    if (!product) {
      throw new NotFoundException(ClientLogError.PRODUCT_NOT_FOUND);
    }

    return product;
  }
}
