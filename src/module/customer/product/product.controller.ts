import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { PaginateQueryDto } from 'src/lib/pagination/dto/paginate-query.dto';
import { Paginate } from 'src/lib/pagination/paginate';
import { ProductService } from './product.service';

@Controller('customer/product')
@ApiTags('Customer Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query() query: PaginateQueryDto) {
    const paginate = new Paginate<Product>(query);
    const { data, total } = await this.productService.getAllProducts(
      paginate.params(),
    );
    return paginate.response(data, total);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }
}
