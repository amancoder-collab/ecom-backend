import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  shipRocketOrderId?: string;

  @IsString()
  @IsOptional()
  shipmentId?: string;

  @IsString()
  @IsOptional()
  awbCode?: string;

  @IsString()
  @IsOptional()
  customOrderId?: string;

  @IsString()
  @IsOptional()
  actualDeliveryDate?: string;

  @IsString()
  @IsOptional()
  estimatedDeliveryDate?: string;

  @IsNumber()
  @IsOptional()
  codCharges?: number;

  @IsNumber()
  @IsOptional()
  shippingCost?: number;

  @IsNumber()
  @IsOptional()
  subTotal?: number;

  @IsNumber()
  @IsOptional()
  totalCost?: number;

  @IsNumber()
  @IsOptional()
  courierCompanyId?: number;

  @IsString()
  @IsOptional()
  orderDate?: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsOptional()
  billingAddressId?: string;

  @IsString()
  @IsOptional()
  shippingAddressId?: string;
}
