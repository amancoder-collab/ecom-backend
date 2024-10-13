import {
  IsString,
  IsInt,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
  MaxLength,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShipRocketOrderDto {
  @IsString()
  @MaxLength(50)
  order_id: string;

  @IsDateString()
  order_date: string;

  @IsString()
  pickup_location: string;

  @IsOptional()
  @IsInt()
  channel_id?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  reseller_name?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsString()
  billing_customer_name: string;

  @IsOptional()
  @IsString()
  billing_last_name?: string;

  @IsString()
  billing_address: string;

  @IsOptional()
  @IsString()
  billing_address_2?: string;

  @IsString()
  @MaxLength(30)
  billing_city: string;

  @IsInt()
  billing_pincode: number;

  @IsString()
  billing_state: string;

  @IsString()
  billing_country: string;

  @IsEmail()
  billing_email: string;

  @IsPhoneNumber()
  billing_phone: string;

  @IsOptional()
  @IsPhoneNumber()
  billing_alternate_phone?: string;

  @IsBoolean()
  shipping_is_billing: boolean;

  @IsOptional()
  @IsString()
  shipping_customer_name?: string;

  @IsOptional()
  @IsString()
  shipping_last_name?: string;

  @IsOptional()
  @IsString()
  shipping_address?: string;

  @IsOptional()
  @IsString()
  shipping_address_2?: string;

  @IsOptional()
  @IsString()
  billing_isd_code?: string;

  @IsOptional()
  @IsString()
  shipping_city?: string;

  @IsOptional()
  @IsInt()
  shipping_pincode?: number;

  @IsOptional()
  @IsString()
  shipping_country?: string;

  @IsOptional()
  @IsString()
  shipping_state?: string;

  @IsOptional()
  @IsEmail()
  shipping_email?: string;

  @IsOptional()
  @IsPhoneNumber()
  shipping_phone?: string;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  order_items: OrderItem[];

  @IsString()
  payment_method: string;

  @IsOptional()
  @IsNumber()
  shipping_charges?: number;

  @IsOptional()
  @IsNumber()
  giftwrap_charges?: number;

  @IsOptional()
  @IsNumber()
  transaction_charges?: number;

  @IsOptional()
  @IsNumber()
  total_discount?: number;

  @IsNumber()
  sub_total: number;

  @IsNumber()
  @Min(0.5)
  length: number;

  @IsNumber()
  @Min(0.5)
  breadth: number;

  @IsNumber()
  @Min(0.5)
  height: number;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsOptional()
  @IsString()
  ewaybill_no?: string;

  @IsOptional()
  @IsString()
  customer_gstin?: string;

  @IsOptional()
  @IsString()
  invoice_number?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ESSENTIALS', 'NON ESSENTIALS'])
  order_type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['SR_RUSH', 'SR_STANDARD', 'SR_EXPRESS', 'SR_QUICK'])
  checkout_shipping_method?: string;

  @IsOptional()
  @IsString()
  what3words_address?: string;

  @IsOptional()
  @IsBoolean()
  is_insurance_opt?: boolean;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  is_document?: number;
}

class OrderItem {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsInt()
  units: number;

  @IsNumber()
  selling_price: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsInt()
  hsn?: number;
}
