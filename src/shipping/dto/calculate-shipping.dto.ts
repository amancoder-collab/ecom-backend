import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CalculateShippingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  delivery_postcode: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn([0, 1])
  cod: 0 | 1;
}
