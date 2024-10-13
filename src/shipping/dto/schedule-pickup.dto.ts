import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SchedulePickupDto {
  @ApiProperty({ description: 'Shipment ID' })
  @IsString()
  @IsNotEmpty()
  shipmentId: string;

  @ApiProperty({
    description: 'Pickup Date(s)',
    type: [String],
    example: ['2022-06-04'],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsDateString({}, { each: true })
  @Type(() => String)
  @IsOptional()
  pickup_date?: string[];

  @ApiProperty({ description: 'Status' })
  @IsString()
  @IsOptional()
  status?: 'retry' | 'schedule';
}
