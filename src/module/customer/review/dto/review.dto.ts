import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @ApiProperty({
    example: 5,
    description: 'add the rating',
    required: true,
  })
  @IsNumber()
  rating: number;

  @ApiProperty({
    example: 'shirt is so good',
    description: 'description of your rating',
    required: true,
  })
  @IsString()
  comment: string;
}
