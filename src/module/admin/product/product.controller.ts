import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Product, Role } from "@prisma/client";
import { Roles } from "src/common/decorator/role.decorator";
import { RolesGuard } from "src/common/guard/role.guard";
import { ApiError } from "src/common/helper/error_description";
import { PaginateQueryDto } from "src/lib/pagination/dto/paginate-query.dto";
import { Paginate } from "src/lib/pagination/paginate";
import { JwtAuthGuard } from "src/module/customer/auth/guards/jwt-auth.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { CreateVariantDto } from "./dto/create-variant.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateVariantDto } from "./dto/update-variant.dto";
import { ProductService } from "./product.service";

@Controller("admin/product")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags("Admin Product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: "Get all products",
    description: "Get all products",
  })
  async findAll(@Query() query: PaginateQueryDto) {
    const paginate = new Paginate<Product>(query);
    const { data, total } = await this.productService.findAll(
      paginate.params(),
    );
    return paginate.response(data, total);
  }

  @Get("variant/:id")
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  async getVariantById(@Param("id") variantId: string) {
    return this.productService.getVariantById(variantId);
  }

  @Get(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  async getProductById(@Param("id") productId: string) {
    return this.productService.findById(productId);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: "add product by SELLER",
    description: "add product by SELLER",
  })
  async create(@Body() dto: CreateProductDto, @Request() req) {
    const AdminId = req.user.id;
    return this.productService.create(dto, AdminId);
  }

  @Post(":productId/variant")
  async createVariant(
    @Body() dto: CreateVariantDto,
    @Param("productId") productId: string,
  ) {
    return this.productService.createVariant(dto, productId);
  }

  @Patch(":productId/variant/:variantId")
  async updateVariant(
    @Body() dto: UpdateVariantDto,
    @Param("productId") productId: string,
    @Param("variantId") variantId: string,
  ) {
    return this.productService.updateVariant(dto, variantId, productId);
  }

  @Patch(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: "update product by SELLER",
    description: "update product by SELLER",
  })
  async updateProduct(
    @Param("id") productId: string,
    @Body() dto: UpdateProductDto,
    @Request() req,
  ) {
    const AdminId = req.user.id;
    return this.productService.update(dto, AdminId, productId);
  }

  @Patch("deactivate/:id")
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: "DeActive product by SELLER",
    description: "DeActive product by SELLER",
  })
  async deactivateProduct(@Param("id") productId: string, @Request() req) {
    const AdminId = req.user.id;
    return this.productService.deactivateProduct(AdminId, productId);
  }

  @Delete("variant/:id")
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  async deleteVariant(@Param("id") variantId: string) {
    return this.productService.deleteVariantById(variantId);
  }

  @Delete(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    description: ApiError.SUCCESS_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ApiError.UNAUTHORIZED_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ApiError.INTERNAL_SERVER_ERROR_MESSAGE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ApiError.BAD_REQUEST,
  })
  @ApiOperation({
    summary: "update product by SELLER",
    description: "update product by SELLER",
  })
  async deleteProducts(@Param("id") productId: string, @Request() req) {
    const AdminId = req.user.id;
    return this.productService.delete(productId, AdminId);
  }
}
