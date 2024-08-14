import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class AddAddressDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Name of the person.',
    })
    @IsString()
    yourName: string;

    @ApiProperty({
        example: '123',
        description: 'House number.',
    })
    @IsString()
    houseNumber: string;

    @ApiProperty({
        example: 'Baker Street',
        description: 'Street address.',
    })
    @IsString()
    street: string;

    @ApiProperty({
        example: 'London',
        description: 'City.',
    })
    @IsString()
    city: string;

    @ApiProperty({
        example: 'Greater London',
        description: 'State or region.',
    })
    @IsString()
    state: string;

    @ApiProperty({
        example: 'india',
        description: 'Country.',
    })
    @IsString()
    country: string;

    @ApiProperty({
        example: '382330',
        description: 'Postal or zip code.',
    })
    @IsString()
    pincode: string;

    @ApiProperty({
        example: 'Near Sherlock Holmes Museum',
        description: 'Landmark or additional address information.',
    })
    @IsString()
    landMark: string;

    @ApiProperty({
        example: '7041767222',
        description: 'Phone number.',
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        example: 'ABC Ltd.',
        description: 'Company name (optional).',
    })
    @IsString()
    @IsOptional()
    companyName?: string;

    @ApiProperty({
        example: '1234567890',
        description: 'GST number (optional).',
    })
    @IsString()
    @IsOptional()
    gstNumber?: string;
}
