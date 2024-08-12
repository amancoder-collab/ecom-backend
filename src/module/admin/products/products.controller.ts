import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiError } from 'src/common/helper/error_description';
import { AddProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guard/role.guard';
import { JwtAuthGuard } from 'src/module/customer/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';

@Controller('products')
@ApiTags('Products-admin')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

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
        summary: 'Get product by USER and SELLER',
        description: 'Get product by USER and SELLER',
    })
    async getListOfProducts() {
        return this.productService.getListProduct();
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
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
        summary: 'add product by SELLER',
        description: 'add product by SELLER',
    })
    async addProducts(@Body() dto: AddProductDto, @Request() req) {
        const AdminId = req.user.id;
        return this.productService.addProducts(dto, AdminId);
    }

    @Patch(':id')
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
        summary: 'update product by SELLER',
        description: 'update product by SELLER',
    })
    async updateProducts(@Body() dto: UpdateProductDto) {
        return this.productService.updateProducts(dto);
    }

    @Delete(':id')
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
        summary: 'update product by SELLER',
        description: 'update product by SELLER',
    })
    async deleteProducts() {
        return this.productService.deleteProducts();
    }
}
