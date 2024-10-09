import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @ApiProperty({
    required: false,
    example: 3,
  })
  @IsInt()
  @Max(10)
  quantity: number;
}
