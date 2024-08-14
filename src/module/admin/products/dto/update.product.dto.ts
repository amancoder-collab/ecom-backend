import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({
        example: 'blue-denim-jeans',
        description: 'The name of the product.',
    })
    @IsString()
    @IsOptional()
    productName?: string;

    @ApiProperty({
        example: 'Comfortable blue denim jeans with a slim fit.',
        description: 'A brief description of the product.',
    })
    @IsString()
    @IsOptional()
    productDescription?: string;

    @ApiProperty({
        example: 50,
        description: 'The quantity of the product available in stock.',
    })
    @IsInt()
    @IsOptional()
    quantities?: number;

    @ApiProperty({
        example: 2000,
        description: 'The price of the product before GST is applied.',
    })
    @IsInt()
    @IsOptional()
    priceWithoutGst?: number;

    @ApiProperty({
        example: 18,
        description: 'The GST percentage applied to the product.',
    })
    @IsInt()
    @IsOptional()
    gst?: number;

    @ApiProperty({
        example: 1800,
        description: 'The discounted price of the product.',
    })
    @IsInt()
    @IsOptional()
    discountedPrices?: number;

    @ApiProperty({
        example: {
            fabric: 'Denim',
            material: '100% Cotton',
            care_instructions: 'Machine wash cold, tumble dry low.',
            color: 'Blue',
            pattern: 'Solid',
            closure_type: 'Zipper',
            sleeve_length: 'N/A',
            country_of_origin: 'India',
            warranty: '6 months against manufacturing defects',
        },
        description:
            'Detailed attributes that describe the product in more depth, such as fabric, material, care instructions, etc.',
    })
    @IsOptional()
    specification?: SpecificationJsonWhileUpdate;

    @ApiProperty({
        example: 100,
        description: 'The current stock level of the product.',
    })
    @IsInt()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: ['S', 'M', 'L', 'XL'],
        description: 'Available sizes for the product.',
    })
    @IsString({ each: true })
    @IsOptional()
    size?: string[];

    @ApiProperty({
        example: ['Blue', 'Black'],
        description: 'Available colors for the product.',
    })
    @IsString({ each: true })
    @IsOptional()
    colors?: string[];

    @ApiProperty({
        example: ['https://image1.com', 'https://image2.com'],
        description: 'URLs of the product images.',
    })
    @IsString({ each: true })
    @IsOptional()
    images?: string[];
}

type SpecificationJsonWhileUpdate = {
    fabric?: string;
    material?: string;
    care_instructions?: string;
    color?: string;
    pattern?: string;
    closure_type?: string;
    sleeve_length?: string;
    country_of_origin?: string;
    warranty?: string;
};
