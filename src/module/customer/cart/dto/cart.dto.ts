import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class AddCart {
    @ApiProperty({
        required: false,
        example: 3,
    })
    @IsInt()
    quantities: number;

    @ApiProperty()
    @IsUUID(undefined, { each: true })
    @IsString()
    productId: string;
}
