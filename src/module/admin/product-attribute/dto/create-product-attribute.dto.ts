import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeDto {
  @ApiProperty({
    example: 'Color',
    description: 'The title of the attribute',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: ['Red', 'Blue', 'Green'],
    description: 'The values of the attribute',
    type: [String],
  })
  @IsArray()
  // @ValidateNested({ each: true })
  @IsNotEmpty()
  values: string[];
}

export class CreateProductAttributeValueDto {
  @ApiProperty({
    example: 'Color',
    description: 'The title of the attribute',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Red',
    description: 'The value of the attribute',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
