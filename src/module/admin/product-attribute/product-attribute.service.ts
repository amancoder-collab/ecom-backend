import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';

@Injectable()
export class ProductAttributeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductAttributeDto) {
    // return this.prisma.productAttribute.create({
    //   data: {
    //     name: dto.name,
    //     value: dto.value,
    //   },
    // });
  }

  async findAll(productId?: string) {
    if (productId) {
      return this.prisma.productAttribute.findMany({
        where: { productId },
      });
    }
    return this.prisma.productAttribute.findMany();
  }

  async findOne(id: string) {
    const attribute = await this.prisma.productAttribute.findUnique({
      where: { id },
    });
    if (!attribute) {
      throw new NotFoundException(`Product attribute with ID ${id} not found`);
    }
    return attribute;
  }

  // async update(
  //   id: string,
  //   updateProductAttributeDto: UpdateProductAttributeDto,
  // ) {
  //   await this.findOne(id);
  //   return this.prisma.productAttribute.update({
  //     where: { id },
  //     data: updateProductAttributeDto,
  //   });
  // }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productAttribute.delete({
      where: { id },
    });
  }
}
