import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductAttributeDto {
  @ApiProperty({ example: 'Color', description: 'The name of the attribute' })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 'Red', description: 'The value of the attribute' })
  @IsString()
  @IsNotEmpty()
  value?: string;
}
