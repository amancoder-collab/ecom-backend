import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginateQueryDto {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit?: number;

  // @ApiProperty({
  //   required: false,
  //   example: 'createdAt:desc',
  // })
  // @IsOptional()
  // @IsString()
  // sort?: string;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // searchFields?: string;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // search?: string;
}
