import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetCouriersDto {
  @ApiProperty()
  @IsString()
  delivery_pincode: string;

  @ApiProperty()
  @IsString()
  pickup_pincode: string;

  @ApiProperty()
  @IsString()
  weight: string;

  @ApiProperty()
  @IsNumber()
  cod: number;
}
