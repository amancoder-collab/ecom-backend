import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { AddProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { ClientLogError } from 'src/common/helper/error_description';
import { Operation } from 'src/common/operations/operation.function';

@Injectable()
export class ProductsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly operation: Operation,
    ) {}

    async addProducts(dto: AddProductDto, AdminId: string) {
        let seller = await this.prismaService.user.findFirst({
            where: {
                id: AdminId,
            },
        });
        if (!seller) {
            throw new NotFoundException(ClientLogError.ONLY_SELLER);
        }
        const result = this.prismaService.$transaction(async (prisma) => {
            const product = await prisma.products.create({
                data: {
                    product_name: dto.productName,
                    product_description: dto.productDescription,
                    quantities: dto.quantities,
                    price_without_gst: dto.priceWithoutGst,
                    gst: dto.gst,
                    descounted_prices: dto.discountedPrices,
                    specification: dto.specification,
                    stock: dto.stock,
                    size: dto.size,
                    colors: dto.colors,
                    images: dto.images,
                    user_id: AdminId,
                },
            });

            return product;
        });

        return result;
    }

    async updateProducts(
        dto: UpdateProductDto,
        AdminId: string,
        productId: string,
    ) {
        const seller = await this.prismaService.user.findFirst({
            where: { id: AdminId },
        });

        if (!seller) {
            throw new NotFoundException(ClientLogError.ONLY_SELLER);
        }

        const productUpdates: ProductUpdateInput = Object.keys(dto).reduce(
            (acc, key) => {
                if (dto[key] !== undefined) {
                    acc[key] = dto[key];
                }
                return acc;
            },
            {} as ProductUpdateInput,
        );

        const updatedProduct = await this.prismaService.products.update({
            where: { id: productId },
            data: productUpdates,
        });

        return updatedProduct;
    }

    async deleteProducts(productId: string, AdminId: string) {
        let seller = await this.prismaService.user.findFirst({
            where: {
                id: AdminId,
            },
        });
        if (!seller) {
            throw new NotFoundException(ClientLogError.ONLY_SELLER);
        }
        return await this.prismaService.products.delete({
            where: {
                id: productId,
            },
        });
    }

    async deactivateProduct(AdminId: string, productId: string) {
        let seller = await this.prismaService.user.findFirst({
            where: {
                id: AdminId,
            },
        });
        if (!seller) {
            throw new NotFoundException(ClientLogError.ONLY_SELLER);
        }
        return await this.prismaService.products.update({
            where: {
                id: productId,
            },
            data: {
                is_live: false,
            },
        });
    }

    async getListProduct(page: number, limit: number) {
        const { skip, take } = this.operation.calculatePagination(page, limit);
        const result = await this.prismaService.products.findMany({
            skip,
            take,
            where: {
                is_live: true,
            },
        });
        return result;
    }
    async getListProductForSeller(page: number, limit: number) {
        const { skip, take } = this.operation.calculatePagination(page, limit);
        const result = await this.prismaService.products.findMany({
            skip,
            take,
        });
        return result;
    }
}
