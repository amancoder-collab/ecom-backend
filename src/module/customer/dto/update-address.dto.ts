import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({
    description: 'The first name of the address',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the address',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'The email of the address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The phone number of the address',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'The address of the address',
    example: '123 Main St, New York, NY 10001',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'The second address line of the address',
    example: 'Apt 1',
  })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({
    description: 'The city of the address',
    example: 'New York',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'The state of the address',
    example: 'NY',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'The country of the address',
    example: 'USA',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'The pincode of the address',
    example: 10001,
  })
  @IsNumber()
  @IsOptional()
  pincode?: number;

  @ApiProperty({
    description: 'Whether the address is default',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
