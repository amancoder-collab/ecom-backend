import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    required: false,
    example: 3,
  })
  @IsInt()
  @Max(10)
  quantity: number;

  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  itemId?: string;

  @ApiProperty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsString()
  color: string;
}
