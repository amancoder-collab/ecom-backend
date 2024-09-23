import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Name of the person.',
    })
    @IsString()
    @IsOptional()
    your_name?: string;

    @ApiProperty({
        example: '123',
        description: 'House number.',
    })
    @IsString()
    @IsOptional()
    house_number?: string;

    @ApiProperty({
        example: 'Baker Street',
        description: 'Street address.',
    })
    @IsString()
    @IsOptional()
    street?: string;

    @ApiProperty({
        example: 'London',
        description: 'City.',
    })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({
        example: 'Greater London',
        description: 'State or region.',
    })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({
        example: 'United Kingdom',
        description: 'Country.',
    })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({
        example: 'NW1 6XE',
        description: 'Postal or zip code.',
    })
    @IsString()
    @IsOptional()
    pincode?: string;

    @ApiProperty({
        example: 'Near Sherlock Holmes Museum',
        description: 'Landmark or additional address information.',
    })
    @IsString()
    @IsOptional()
    land_mark?: string;

    @ApiProperty({
        example: '+44 20 7946 0958',
        description: 'Phone number.',
    })
    @IsString()
    @IsOptional()
    phone_number?: string;

    @ApiProperty({
        example: 'ABC Ltd.',
        description: 'Company name (optional).',
    })
    @IsString()
    @IsOptional()
    company_name?: string;

    @ApiProperty({
        example: '1234567890',
        description: 'GST number (optional).',
    })
    @IsString()
    @IsOptional()
    gst_number?: string;
}
