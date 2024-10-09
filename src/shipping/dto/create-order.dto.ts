import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEmail,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 'Kunai' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'chakra123' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  units: number;

  @ApiProperty({ example: '900' })
  @IsString()
  selling_price: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  tax?: number;

  @ApiProperty({ example: 441122 })
  @IsNumber()
  hsn: number;
}

export class CreateShipRocketOrderDto {
  @ApiProperty({ example: '224-447' })
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsString()
  reseller_name: string;

  @ApiProperty()
  @IsString()
  company_name: string;

  @ApiProperty({ example: new Date().toISOString() })
  @IsString()
  order_date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  channel_id?: string;

  @ApiPropertyOptional({ example: 'Reseller: M/s Goku' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ example: 'Naruto' })
  @IsString()
  billing_customer_name: string;

  @ApiProperty({ example: 'Uzumaki' })
  @IsString()
  billing_last_name: string;

  @ApiProperty({ example: 'House 221B, Leaf Village' })
  @IsString()
  billing_address: string;

  @ApiProperty({ example: 'Near Hokage House' })
  @IsString()
  billing_address_2: string;

  @ApiProperty({ example: 'New Delhi' })
  @IsString()
  billing_city: string;

  @ApiProperty({ example: '110002' })
  @IsString()
  billing_pincode: string;

  @ApiProperty({ example: 'Delhi' })
  @IsString()
  billing_state: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  billing_country: string;

  @ApiProperty({ example: 'naruto@uzumaki.com' })
  @IsEmail()
  billing_email: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  billing_phone: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  shipping_is_billing: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_customer_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_last_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_address_2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_pincode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_phone?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  order_items: OrderItemDto[];

  @ApiProperty({ example: 'Prepaid' })
  @IsString()
  payment_method: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  shipping_charges: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  giftwrap_charges: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  transaction_charges: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  total_discount: number;

  @ApiProperty({ example: 9000 })
  @IsNumber()
  sub_total: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  length: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  breadth: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 2.5 })
  @IsNumber()
  weight: number;
}
