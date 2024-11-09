import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CreateProductAttributeDto,
  CreateProductAttributeValueDto,
} from '../../product-attribute/dto/create-product-attribute.dto';

export class VariantDto {
  @ApiProperty({
    example: '1234567890',
    description: 'The SKU of the variant',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    example: 100,
    description: 'The weight of the variant',
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({
    example: 100,
    description: 'The width of the variant',
  })
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @ApiProperty({
    example: 100,
    description: 'The height of the variant',
  })
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty({
    example: 100,
    description: 'The length of the variant',
  })
  @IsNumber()
  @IsNotEmpty()
  length: number;

  @ApiProperty({
    example: 100,
    description: 'The price of the variant',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 100,
    description: 'The discounted price of the variant',
  })
  @IsNumber()
  @IsOptional()
  discountedPrice?: number;

  @ApiProperty({
    example: true,
    description: 'Whether the variant is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: 100,
    description: 'The stock of the variant',
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    example: 'https://example.com/thumbnail.jpg',
    description: 'The thumbnail of the variant',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'The images of the variant',
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    description: 'attributes of variant',
    type: [CreateProductAttributeValueDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeValueDto)
  attributes: CreateProductAttributeValueDto[];
}

export class CreateProductDto {
  @ApiProperty({
    example: 'red t-shirt',
    description: 'red t-shirt',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'red silky shirt',
    description: 'red silky shirt',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the product is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the product has variants',
  })
  @IsBoolean()
  @IsNotEmpty()
  hasVariants: boolean;

  @ApiProperty({
    example: 100,
    description: 'The weight of the product',
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: 'The width of the product',
  })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty({
    description: 'The height of the product',
  })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({
    description: 'The length of the product',
  })
  @IsNumber()
  @IsOptional()
  length?: number;

  @ApiProperty({
    example: 100,
    description: 'The stock of the product',
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'thumbnail of product',
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    type: [String],
    description: 'images of product',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: 1599,
    description: 'priceWithoutTax of product',
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 1299,
    description: 'discountedPrice of product',
  })
  @IsNumber()
  @IsOptional()
  discountedPrice?: number;

  @ApiProperty({
    description: 'variants of product',
    type: [VariantDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @IsOptional()
  variants?: VariantDto[];

  @ApiProperty({
    description: 'attributes of product',
    type: [CreateProductAttributeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  @IsOptional()
  attributes?: CreateProductAttributeDto[];
}
