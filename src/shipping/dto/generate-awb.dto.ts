import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
