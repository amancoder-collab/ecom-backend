import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
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
    description: 'The breadth of the variant',
  })
  @IsNumber()
  @IsNotEmpty()
  breadth: number;

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
  @IsNotEmpty()
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
  name: string;

  @ApiProperty({
    example: 'red silky shirt',
    description: 'red silky shirt',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'thumbnail of product',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    example: 1599,
    description: 'priceWithoutTax of product',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 18,
    description: 'priceWithoutGst of product',
  })
  @IsNumber()
  tax: number;

  @ApiProperty({
    example: 1299,
    description: 'discountedPrice of product',
  })
  @IsNumber()
  discountedPrice: number;

  @ApiProperty({
    description: 'variants of product',
    type: [VariantDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}
