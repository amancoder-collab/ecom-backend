import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { AddProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { ClientLogError } from 'src/common/helper/error_description';
import { Operation } from 'src/common/operations/operation.function';
import { Role } from '@prisma/client';
import { Pagination } from 'src/lib/pagination/paginate';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly operation: Operation,
  ) {}

  async addProducts(dto: AddProductDto, sellerId: string) {
    const seller = await this.prismaService.user.findFirst({
      where: {
        id: sellerId,
        role: Role.SELLER,
      },
    });
    if (!seller) {
      throw new NotFoundException(ClientLogError.ONLY_SELLER);
    }
    const result = this.prismaService.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          name: dto.productName,
          weight: dto.weight,
          sku: dto.sku,
          breadth: dto.breadth,
          height: dto.height,
          length: dto.length,
          description: dto.productDescription,
          priceWithoutTax: dto.priceWithoutGst,
          tax: dto.gst,
          discountedPrice: dto.discountedPrices,
          specification: dto.specification,
          stock: dto.stock,
          sizes: dto.size,
          colors: dto.colors,
          images: dto.images,
          seller: {
            connect: {
              id: sellerId,
            },
          },
        },
      });

      return product;
    });

    return result;
  }

  async updateProducts(
    dto: UpdateProductDto,
    sellerId: string,
    productId: string,
  ) {
    const seller = await this.prismaService.user.findFirst({
      where: { id: sellerId, role: 'SELLER' },
    });

    if (!seller) {
      throw new NotFoundException(ClientLogError.ONLY_SELLER);
    }

    const productUpdates = Object.keys(dto).reduce((acc, key) => {
      if (dto[key] !== undefined) {
        acc[key] = dto[key];
      }
      return acc;
    }, {} as Partial<UpdateProductDto>);

    const updatedProduct = await this.prismaService.product.update({
      where: { id: productId },
      data: productUpdates,
    });

    return updatedProduct;
  }

  async deleteProducts(productId: string, sellerId: string) {
    const seller = await this.prismaService.user.findFirst({
      where: {
        id: sellerId,
        role: 'SELLER',
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
        role: 'SELLER',
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

  async getListProductForSeller(page: number, limit: number) {
    const { skip, take } = this.operation.calculatePagination(page, limit);
    const result = await this.prismaService.product.findMany({
      skip,
      take,
    });
    return result;
  }
}
