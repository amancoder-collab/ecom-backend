import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/role.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@ApiTags('Product Attributes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/product-attribute')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product attribute' })
  @ApiResponse({
    status: 201,
    description: 'The product attribute has been successfully created.',
  })
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.create(createProductAttributeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product attributes' })
  @ApiResponse({ status: 200, description: 'Return all product attributes.' })
  findAll(@Query('productId') productId?: string) {
    return this.productAttributeService.findAll(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product attribute by id' })
  @ApiResponse({ status: 200, description: 'Return the product attribute.' })
  findOne(@Param('id') id: string) {
    return this.productAttributeService.findOne(id);
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a product attribute' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The product attribute has been successfully updated.',
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateProductAttributeDto: UpdateProductAttributeDto,
  // ) {
  //   return this.productAttributeService.update(id, updateProductAttributeDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product attribute' })
  @ApiResponse({
    status: 200,
    description: 'The product attribute has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.productAttributeService.remove(id);
  }
}
