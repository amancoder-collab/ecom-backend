import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CancelOrderDto {
  @ApiProperty({ description: 'Order IDs' })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
