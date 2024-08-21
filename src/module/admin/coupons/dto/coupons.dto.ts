import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
    @ApiProperty({
        example: '15% off',
        description: 'add coupon title',
        required: true,
    })
    @IsString()
    couponTitle: string;

    @ApiProperty({
        example: 'BANNASA50',
        description: 'add coupon code',
        required: true,
    })
    @IsString()
    couponCode: string;

    @ApiProperty({
        example: ['need to buy min 1500', 'subject to market risk'],
        description: 'add coupon terms and conditions',
        required: true,
    })
    couponTnc: string[];

    @ApiProperty({
        example: 15,
        description: 'discount percentage coupon code',
        required: true,
    })
    discountPercentage: number;

    @ApiProperty({
        example: '2024-01-01',
        description: 'add coupon valid from',
        required: true,
    })
    @IsString()
    ValidFrom: Date;

    @ApiProperty({
        example: '2024-12-12',
        description: 'coupon valid till',
        required: true,
    })
    @IsString()
    ValidTo: Date;

    @ApiProperty({
        example: 599,
        description: 'maximum discount can ve avail',
        required: true,
    })
    MaxDiscountAmount: number;

    @ApiProperty({
        example: 1499,
        description: 'maximum purchase amount',
        required: true,
    })
    MinPurchaseAmount: number;
}
