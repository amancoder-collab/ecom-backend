import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GenerateAWBDto {
  @ApiProperty({ description: 'Shipment ID' })
  @IsString()
  @IsNotEmpty()
  shipmentId: string;

  @ApiProperty({ description: 'Courier ID' })
  @IsNumber()
  @IsNotEmpty()
  courierId: number;
}

export class GenerateAWBForReturnDto extends GenerateAWBDto {
  @ApiProperty({ description: 'Is return' })
  @IsBoolean()
  @IsNotEmpty()
  isReturn: boolean;
}
