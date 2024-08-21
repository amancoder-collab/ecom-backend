import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class ApplyCouponDto {
    @ApiProperty({
        example: 'BANNASA10',
        description: 'add coupon title',
        required: true,
    })
    @IsString()
    couponCode: string;

    @ApiProperty({
        example: '2100',
        description: 'order amount form the cart summary',
        required: true,
    })
    orderAmount: number;
}
