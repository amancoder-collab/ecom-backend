import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    required: false,
    example: 3,
  })
  @IsInt()
  quantity: number;

  @ApiProperty()
  @IsUUID(undefined, { each: true })
  @IsString()
  productId: string;
}
