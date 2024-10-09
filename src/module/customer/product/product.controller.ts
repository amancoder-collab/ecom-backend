import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginateQueryDto } from 'src/lib/pagination/dto/paginate-query.dto';

@Controller('customer/product')
@ApiTags('Customer Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query() query: PaginateQueryDto) {
    return this.productService.getAllProducts(query);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }
}
