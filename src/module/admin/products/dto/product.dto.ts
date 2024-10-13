import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class AddProductDto {
  @ApiProperty({
    example: 'red t-shirt',
    description: 'red t-shirt',
  })
  @IsString()
  productName: string;

  @ApiProperty({
    example: 'SKU123',
    description: 'SKU of product',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    example: 'red silky shirt',
    description: 'red silky shirt',
  })
  @IsString()
  productDescription: string;

  @ApiProperty({
    example: 10,
    description: 'quantities of product',
  })
  @IsNumber()
  quantities: number;

  @ApiProperty({
    example: 1599,
    description: 'priceWithoutGst of product',
  })
  @IsNumber()
  priceWithoutGst: number;

  @ApiProperty({
    example: 18,
    description: 'priceWithoutGst of product',
  })
  @IsNumber()
  gst: number;

  @ApiProperty({
    example: 1299,
    description: 'discountedPrices of product',
  })
  @IsNumber()
  discountedPrices: number;

  @ApiProperty({
    example: 1,
    description: 'weight of product in kg',
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    example: 1,
    description: 'breadth of product in cm',
  })
  @IsNumber()
  breadth: number;

  @ApiProperty({
    example: 1,
    description: 'height of product in cm',
  })
  @IsNumber()
  height: number;

  @ApiProperty({
    example: 1,
    description: 'length of product in cm',
  })
  @IsNumber()
  length: number;

  @ApiProperty({
    example: {
      fabric: 'Cotton',
      material: '100% Organic Cotton',
      care_instructions: 'Machine wash cold, tumble dry low, iron if needed',
      color: 'Blue',
      pattern: 'Solid',
      closure_type: 'Button',
      sleeve_length: 'Short Sleeve',
      country_of_origin: 'India',
      warranty: '1 year against manufacturing defects',
    },
    description:
      'Detailed attributes that describe the product in more depth, such as fabric, material, care instructions, etc.',
  })
  specification: specificationJson;

  @ApiProperty({
    example: 100,
    description: 'discountedPrices of product',
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    example: ['XXL', 'S', 'M', 'L', 'XL'],
    description: 'size of product available',
  })
  size: string[];

  @ApiProperty({
    example: ['red', 'green'],
    description: 'colors of product available',
  })
  colors: string[];

  @ApiProperty({
    example: ['https://image.com', 'https://image2com', 'https://image3.com'],
    description: 'images of product',
  })
  images: string[];
}

type specificationJson = {
  fabric: string;
  material: string;
  care_instructions: string;
  color: string;
  pattern: string;
  closure_type: string;
  sleeve_length: string;
  country_of_origin: string;
  warranty: string;
};
