import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CalculateShippingDto {
  @ApiProperty()
  @IsString()
  delivery_postcode: string;

  @ApiProperty()
  @IsNumber()
  cod: number;
}
