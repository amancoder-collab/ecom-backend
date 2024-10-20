import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max } from 'class-validator';

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
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  variantId: string;
}
