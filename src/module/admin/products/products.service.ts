import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { AddProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { ClientLogError } from 'src/common/helper/error_description';

@Injectable()
export class ProductsService {
    constructor(private readonly prismaService: PrismaService) {}

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
                },
            });

            return product;
        });

        return result;
    }
    async updateProducts(dto: UpdateProductDto) {}
    async deleteProducts() {}
    async getListProduct() {}
}
